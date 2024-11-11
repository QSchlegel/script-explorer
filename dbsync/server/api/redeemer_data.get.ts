import sql from '~/utils/db';
import { defineEventHandler, getQuery } from 'h3';

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

    // Define filters for redeemer_data columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      hash: { single: query.hash },
      tx_id: { single: query.tx_id },
      value: { single: query.value },
      bytes: { single: query.bytes }
    };

    // Add conditions for single-value filters
    for (const [field, range] of Object.entries(filters)) {
      if (range.single !== undefined) {
        conditions.push(`${field} = $${conditions.length + 1}`);
        values.push(range.single);
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
      FROM redeemer_data
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const redeemerDataRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return redeemerDataRecords;
  } catch (err) {
    console.error('Error in /api/redeemer_data:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});