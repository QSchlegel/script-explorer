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

    // Define filters for drep_registration columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      tx_id: { single: query.tx_id, min: query.min_tx_id, max: query.max_tx_id },
      cert_index: { single: query.cert_index, min: query.min_cert_index, max: query.max_cert_index },
      deposit: { single: query.deposit, min: query.min_deposit, max: query.max_deposit },
      drep_hash_id: { single: query.drep_hash_id },
      voting_anchor_id: { single: query.voting_anchor_id }
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
      SELECT id, tx_id, cert_index, deposit, drep_hash_id, voting_anchor_id
      FROM drep_registration
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const drepRegistrations = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return drepRegistrations;
  } catch (err) {
    console.error('Error in /api/drep_registration:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});