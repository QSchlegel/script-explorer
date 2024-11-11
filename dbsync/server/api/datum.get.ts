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

    // Define filters for datum columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      hash: { single: query.hash },
      tx_id: { single: query.tx_id, min: query.min_tx_id, max: query.max_tx_id },
      value: { single: query.value },
    };

    // Add conditions for single-value and range-based filters
    for (const [field, range] of Object.entries(filters)) {
      if (range.single !== undefined) {
        if (field === 'hash') {
          const preparedHash = prepareHashForQuery(range.single);
          conditions.push(`encode(${field}, 'hex') = $${conditions.length + 1}`);
          values.push(preparedHash);
        } else if (field === 'value') {
          conditions.push(`${field} @> $${conditions.length + 1}::jsonb`);
          values.push(range.single);
        } else {
          const singleValue = parseInt(range.single, 10);
          if (!isNaN(singleValue)) {
            conditions.push(`${field} = $${conditions.length + 1}`);
            values.push(singleValue);
          }
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
      SELECT id, encode(hash, 'hex') AS hash, tx_id, value, encode(bytes, 'hex') AS bytes
      FROM datum
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const datumRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return datumRecords;
  } catch (err) {
    console.error('Error in /api/datum:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});