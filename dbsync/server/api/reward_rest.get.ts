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

    // Define filters for reward_rest columns
    const filters = {
      addr_id: { single: query.addr_id },
      type: { single: query.type },
      amount: { single: query.amount, min: query.min_amount, max: query.max_amount },
      spendable_epoch: { single: query.spendable_epoch, min: query.min_spendable_epoch, max: query.max_spendable_epoch },
      earned_epoch: { single: query.earned_epoch, min: query.min_earned_epoch, max: query.max_earned_epoch }
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
      SELECT addr_id, type, amount, spendable_epoch, earned_epoch
      FROM reward_rest
      ${whereClause}
      ORDER BY spendable_epoch ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const rewardRestRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return rewardRestRecords;
  } catch (err) {
    console.error('Error in /api/reward_rest:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});