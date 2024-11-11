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

    // Define filters for epoch_stake_progress columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      epoch_no: { single: query.epoch_no, min: query.min_epoch_no, max: query.max_epoch_no },
      completed: { single: query.completed }
    };

    // Add conditions for single-value and range-based filters
    for (const [field, range] of Object.entries(filters)) {
      if (range.single !== undefined) {
        if (field === 'completed') {
          const completedValue = range.single.toLowerCase() === 'true';
          conditions.push(`${field} = $${conditions.length + 1}`);
          values.push(completedValue);
        } else {
          conditions.push(`${field} = $${conditions.length + 1}`);
          values.push(range.single);
        }
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
      SELECT id, epoch_no, completed
      FROM epoch_stake_progress
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const epochStakeProgressRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return epochStakeProgressRecords;
  } catch (err) {
    console.error('Error in /api/epoch_stake_progress:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});