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

    // Define filters for epoch_state columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      committee_id: { single: query.committee_id },
      no_confidence_id: { single: query.no_confidence_id },
      constitution_id: { single: query.constitution_id },
      epoch_no: { single: query.epoch_no, min: query.min_epoch_no, max: query.max_epoch_no }
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
      SELECT id, committee_id, no_confidence_id, constitution_id, epoch_no
      FROM epoch_state
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const epochStateRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return epochStateRecords;
  } catch (err) {
    console.error('Error in /api/epoch_state:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});