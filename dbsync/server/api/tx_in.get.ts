import sql from '~/utils/db';
import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  try {
    // Set pagination parameters with defaults
    const limit = parseInt(query.limit) || 20;
    const offset = parseInt(query.offset) || 0;

    // Set order parameter, default to DESC if not provided
    let orderBy = 'DESC';
    if (query.order && query.order.toLowerCase() === 'asc') {
      orderBy = 'ASC';
    }

    // Initialize conditions array for WHERE clause and values array for parameterized queries
    const conditions = [];
    const values = [];

    // Define filters for tx_in columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      tx_in_id: { single: query.tx_in_id, min: query.min_tx_in_id, max: query.max_tx_in_id },
      tx_out_id: { single: query.tx_out_id, min: query.min_tx_out_id, max: query.max_tx_out_id },
      tx_out_index: { single: query.tx_out_index, min: query.min_tx_out_index, max: query.max_tx_out_index },
      redeemer_id: { single: query.redeemer_id, min: query.min_redeemer_id, max: query.max_redeemer_id }
    };

    // Apply single and range-based filters for each field
    for (const [field, range] of Object.entries(filters)) {
      if (range.single !== undefined) {
        const singleValue = parseInt(range.single, 10);
        if (!isNaN(singleValue)) {
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
      SELECT * FROM tx_in
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    // Execute query
    const txIns = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return results
    return txIns;
  } catch (err) {
    console.error('Error in /api/tx_in:', err);
    return { error: err.message || 'An unexpected error occurred' };
  }
});