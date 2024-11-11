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

    // Define filters for pool_stat columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      pool_hash_id: { single: query.pool_hash_id },
      epoch_no: { single: query.epoch_no, min: query.min_epoch_no, max: query.max_epoch_no },
      number_of_blocks: { single: query.number_of_blocks, min: query.min_number_of_blocks, max: query.max_number_of_blocks },
      number_of_delegators: { single: query.number_of_delegators, min: query.min_number_of_delegators, max: query.max_number_of_delegators },
      stake: { single: query.stake, min: query.min_stake, max: query.max_stake },
      voting_power: { single: query.voting_power, min: query.min_voting_power, max: query.max_voting_power }
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
      SELECT id, pool_hash_id, epoch_no, number_of_blocks, number_of_delegators, stake, voting_power
      FROM pool_stat
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const poolStatRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return poolStatRecords;
  } catch (err) {
    console.error('Error in /api/pool_stat:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});