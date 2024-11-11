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

    // Define filters for epoch columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      no: { single: query.no, min: query.min_no, max: query.max_no },
      out_sum: { min: query.min_out_sum, max: query.max_out_sum },
      fees: { min: query.min_fees, max: query.max_fees },
      tx_count: { min: query.min_tx_count, max: query.max_tx_count },
      blk_count: { min: query.min_blk_count, max: query.max_blk_count },
      start_time: { min: query.start_time, max: query.end_time }
    };

    // Add conditions for single-value and range-based filters
    for (const [field, range] of Object.entries(filters)) {
      if (range.single !== undefined) {
        conditions.push(`${field} = $${conditions.length + 1}`);
        values.push(range.single);
      }
      if (range.min !== undefined) {
        conditions.push(`${field} >= $${conditions.length + 1}`);
        values.push(range.min);
      }
      if (range.max !== undefined) {
        conditions.push(`${field} <= $${conditions.length + 1}`);
        values.push(range.max);
      }
    }

    // Build WHERE clause
    let whereClause = '';
    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // Final SQL query with ORDER BY clause
    const queryString = `
      SELECT id, out_sum, fees, tx_count, blk_count, no, start_time, end_time
      FROM epoch
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const epochRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return epochRecords;
  } catch (err) {
    console.error('Error in /api/epoch:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});