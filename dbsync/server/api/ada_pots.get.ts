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

    // Define filters for ada_pots columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      slot_no: { single: query.slot_no, min: query.min_slot_no, max: query.max_slot_no },
      epoch_no: { single: query.epoch_no, min: query.min_epoch_no, max: query.max_epoch_no },
      treasury: { min: query.min_treasury, max: query.max_treasury },
      reserves: { min: query.min_reserves, max: query.max_reserves },
      rewards: { min: query.min_rewards, max: query.max_rewards },
      utxo: { min: query.min_utxo, max: query.max_utxo },
      deposits_stake: { min: query.min_deposits_stake, max: query.max_deposits_stake },
      fees: { min: query.min_fees, max: query.max_fees },
      block_id: { single: query.block_id },
      deposits_drep: { min: query.min_deposits_drep, max: query.max_deposits_drep },
      deposits_proposal: { min: query.min_deposits_proposal, max: query.max_deposits_proposal }
    };

    // Add conditions for single-value and range-based filters
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
      SELECT id, slot_no, epoch_no, treasury, reserves, rewards, utxo, deposits_stake, fees, block_id, deposits_drep, deposits_proposal
      FROM ada_pots
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const adaPotsRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return adaPotsRecords;
  } catch (err) {
    console.error('Error in /api/ada_pots:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});