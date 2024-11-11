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

    // Define filters for pool_update columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      hash_id: { single: query.hash_id },
      cert_index: { single: query.cert_index },
      vrf_key_hash: { single: query.vrf_key_hash },
      pledge: { single: query.pledge, min: query.min_pledge, max: query.max_pledge },
      active_epoch_no: { single: query.active_epoch_no, min: query.min_active_epoch_no, max: query.max_active_epoch_no },
      meta_id: { single: query.meta_id },
      margin: { single: query.margin, min: query.min_margin, max: query.max_margin },
      fixed_cost: { single: query.fixed_cost, min: query.min_fixed_cost, max: query.max_fixed_cost },
      registered_tx_id: { single: query.registered_tx_id },
      reward_addr_id: { single: query.reward_addr_id },
      deposit: { single: query.deposit, min: query.min_deposit, max: query.max_deposit }
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
      SELECT id, hash_id, cert_index, encode(vrf_key_hash, 'hex') AS vrf_key_hash, pledge, 
             active_epoch_no, meta_id, margin, fixed_cost, registered_tx_id, reward_addr_id, deposit
      FROM pool_update
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const poolUpdateRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return poolUpdateRecords;
  } catch (err) {
    console.error('Error in /api/pool_update:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});