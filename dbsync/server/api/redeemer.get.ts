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

    // Define filters for redeemer columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      tx_id: { single: query.tx_id },
      unit_mem: { single: query.unit_mem, min: query.min_unit_mem, max: query.max_unit_mem },
      unit_steps: { single: query.unit_steps, min: query.min_unit_steps, max: query.max_unit_steps },
      fee: { single: query.fee, min: query.min_fee, max: query.max_fee },
      purpose: { single: query.purpose },
      index: { single: query.index, min: query.min_index, max: query.max_index },
      script_hash: { single: query.script_hash },
      redeemer_data_id: { single: query.redeemer_data_id }
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
      SELECT id, tx_id, unit_mem, unit_steps, fee, purpose, index, encode(script_hash, 'hex') AS script_hash, redeemer_data_id
      FROM redeemer
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const redeemerRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return redeemerRecords;
  } catch (err) {
    console.error('Error in /api/redeemer:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});