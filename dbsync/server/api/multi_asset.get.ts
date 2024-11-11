import sql from '~/utils/db';
import { defineEventHandler, getQuery } from 'h3';

// Function to prepare binary hash fields for querying
function prepareBinaryFieldForQuery(field) {
    if (typeof field !== 'string' || !/^[0-9a-fA-F]+$/.test(field)) {
        throw new Error('Invalid hex string format');
    }
    return field;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    // Pagination parameters with defaults
    const limit = parseInt(query.limit) || 20;
    const offset = parseInt(query.offset) || 0;

    // Set the ordering direction, defaulting to DESC
    let orderBy = 'DESC';
    if (query.order && query.order.toLowerCase() === 'asc') {
      orderBy = 'ASC';
    }

    // Initialize conditions array for WHERE clause and values array for parameterized queries
    const conditions = [];
    const values = [];

    // Define filters for multi_asset columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      policy: { single: query.policy },
      name: { single: query.name },
      fingerprint: { single: query.fingerprint }
    };

    // Add conditions for single-value and range-based filters
    for (const [field, range] of Object.entries(filters)) {
      if (range.single !== undefined) {
        if (field === 'policy' || field === 'name') {
          const preparedField = prepareBinaryFieldForQuery(range.single);
          conditions.push(`${field} = decode($${conditions.length + 1}, 'hex')`);
          values.push(preparedField);
        } else {
          const singleValue = range.single;
          conditions.push(`${field} = $${conditions.length + 1}`);
          values.push(singleValue);
        }
      }
      if (range.min !== undefined) {
        const minValue = parseInt(range.min, 10);
        if (!isNaN(minValue)) {
          conditions.push(`${field} >= $${conditions.length + 1}`);
          values.push(minValue);
        }
      }
      if (range.max !== undefined) {
        const maxValue = parseInt(range.max, 10);
        if (!isNaN(maxValue)) {
          conditions.push(`${field} <= $${conditions.length + 1}`);
          values.push(maxValue);
        }
      }
    }

    // Build WHERE clause
    let whereClause = '';
    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // Final SQL query with ORDER BY clause
    const queryString = `
      SELECT id, encode(policy, 'hex') AS policy, encode(name, 'hex') AS name, fingerprint
      FROM multi_asset
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const multiAssets = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return multiAssets;
  } catch (err) {
    console.error('Error in /api/multi_asset:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});