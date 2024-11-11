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

    // Define filters for utxo_byron_view columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      tx_id: { single: query.tx_id },
      index: { single: query.index },
      address: { single: query.address },
      address_has_script: { single: query.address_has_script },
      payment_cred: { single: query.payment_cred },
      stake_address_id: { single: query.stake_address_id },
      value: { min: query.min_value, max: query.max_value },
      data_hash: { single: query.data_hash },
      inline_datum_id: { single: query.inline_datum_id },
      reference_script_id: { single: query.reference_script_id }
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
      SELECT id, tx_id, index, address, address_has_script, payment_cred, stake_address_id, value, data_hash, inline_datum_id, reference_script_id
      FROM utxo_byron_view
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const utxoByronRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return utxoByronRecords;
  } catch (err) {
    console.error('Error in /api/utxo_byron_view:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});