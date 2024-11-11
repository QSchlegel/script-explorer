import sql from '~/utils/db';
import { defineEventHandler, getQuery } from 'h3';

// Function to prepare binary hash fields for querying
function prepareHashForQuery(hash) {
    if (typeof hash !== 'string' || !/^[0-9a-fA-F]+$/.test(hash)) {
        throw new Error('Invalid hex string format');
    }
    return hash;
}

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

    // Define filters for collateral_tx_out columns
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      tx_id: { single: query.tx_id },
      index: { single: query.index, min: query.min_index, max: query.max_index },
      address: { single: query.address },
      value: { min: query.min_value, max: query.max_value },
      stake_address_id: { single: query.stake_address_id },
      address_has_script: { single: query.address_has_script },
      payment_cred: { single: query.payment_cred },
      data_hash: { single: query.data_hash },
      multi_assets_descr: { single: query.multi_assets_descr },
      inline_datum_id: { single: query.inline_datum_id },
      reference_script_id: { single: query.reference_script_id }
    };

    // Add conditions for single-value and range-based filters
    for (const [field, range] of Object.entries(filters)) {
      if (range.single !== undefined) {
        if (field === 'payment_cred' || field === 'data_hash') {
          const preparedHash = prepareHashForQuery(range.single);
          conditions.push(`encode(${field}, 'hex') = $${conditions.length + 1}`);
          values.push(preparedHash);
        } else if (field === 'address_has_script') {
          const hasScriptValue = range.single.toLowerCase() === 'true';
          conditions.push(`${field} = $${conditions.length + 1}`);
          values.push(hasScriptValue);
        } else {
          conditions.push(`${field} = $${conditions.length + 1}`);
          values.push(range.single);
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
      SELECT id, tx_id, index, address, address_has_script, encode(payment_cred, 'hex') AS payment_cred,
             stake_address_id, value, encode(data_hash, 'hex') AS data_hash, multi_assets_descr,
             inline_datum_id, reference_script_id
      FROM collateral_tx_out
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const collateralTxOutRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return collateralTxOutRecords;
  } catch (err) {
    console.error('Error in /api/collateral_tx_out:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});