import sql from '~/utils/db';
import { defineEventHandler, getQuery } from 'h3';

// Function to prepare binary hash fields for querying
function prepareHashForQuery(hash) {
    if (typeof hash !== 'string' || !/^[0-9a-fA-F]+$/.test(hash)) {
        throw new Error('Invalid hex string format');
    }
    return hash;
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

    // Define filters for cost_model columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      hash: { single: query.hash }
    };

    // Add conditions for single-value and range-based filters
    for (const [field, range] of Object.entries(filters)) {
      if (range.single !== undefined) {
        if (field === 'hash') {
          const preparedHash = prepareHashForQuery(range.single);
          conditions.push(`encode(${field}, 'hex') = $${conditions.length + 1}`);
          values.push(preparedHash);
        } else {
          conditions.push(`${field} = $${conditions.length + 1}`);
          values.push(range.single);
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
      SELECT id, costs, encode(hash, 'hex') AS hash
      FROM cost_model
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const costModelRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return costModelRecords;
  } catch (err) {
    console.error('Error in /api/cost_model:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});