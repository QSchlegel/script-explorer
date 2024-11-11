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

    // Define filters for all columns in epoch_param
    const filters = {
      id: { single: query.id, min: query.min_id, max: query.max_id },
      epoch_no: { single: query.epoch_no, min: query.min_epoch_no, max: query.max_epoch_no },
      min_fee_a: { min: query.min_fee_a_min, max: query.min_fee_a_max },
      min_fee_b: { min: query.min_fee_b_min, max: query.min_fee_b_max },
      max_block_size: { min: query.max_block_size_min, max: query.max_block_size_max },
      max_tx_size: { min: query.max_tx_size_min, max: query.max_tx_size_max },
      max_bh_size: { min: query.max_bh_size_min, max: query.max_bh_size_max },
      key_deposit: { min: query.key_deposit_min, max: query.key_deposit_max },
      pool_deposit: { min: query.pool_deposit_min, max: query.pool_deposit_max },
      max_epoch: { min: query.max_epoch_min, max: query.max_epoch_max },
      optimal_pool_count: { min: query.optimal_pool_count_min, max: query.optimal_pool_count_max },
      influence: { min: query.influence_min, max: query.influence_max },
      monetary_expand_rate: { min: query.monetary_expand_rate_min, max: query.monetary_expand_rate_max },
      treasury_growth_rate: { min: query.treasury_growth_rate_min, max: query.treasury_growth_rate_max },
      decentralisation: { min: query.decentralisation_min, max: query.decentralisation_max },
      protocol_major: { single: query.protocol_major },
      protocol_minor: { single: query.protocol_minor },
      min_utxo_value: { min: query.min_utxo_value_min, max: query.min_utxo_value_max },
      min_pool_cost: { min: query.min_pool_cost_min, max: query.min_pool_cost_max },
      nonce: { single: query.nonce },
      cost_model_id: { single: query.cost_model_id },
      price_mem: { min: query.price_mem_min, max: query.price_mem_max },
      price_step: { min: query.price_step_min, max: query.price_step_max },
      max_tx_ex_mem: { min: query.max_tx_ex_mem_min, max: query.max_tx_ex_mem_max },
      max_tx_ex_steps: { min: query.max_tx_ex_steps_min, max: query.max_tx_ex_steps_max },
      max_block_ex_mem: { min: query.max_block_ex_mem_min, max: query.max_block_ex_mem_max },
      max_block_ex_steps: { min: query.max_block_ex_steps_min, max: query.max_block_ex_steps_max },
      max_val_size: { min: query.max_val_size_min, max: query.max_val_size_max },
      collateral_percent: { min: query.collateral_percent_min, max: query.collateral_percent_max },
      max_collateral_inputs: { min: query.max_collateral_inputs_min, max: query.max_collateral_inputs_max },
      block_id: { single: query.block_id },
      extra_entropy: { single: query.extra_entropy },
      coins_per_utxo_size: { min: query.coins_per_utxo_size_min, max: query.coins_per_utxo_size_max },
      pvt_motion_no_confidence: { min: query.pvt_motion_no_confidence_min, max: query.pvt_motion_no_confidence_max },
      pvt_committee_normal: { min: query.pvt_committee_normal_min, max: query.pvt_committee_normal_max },
      pvt_committee_no_confidence: { min: query.pvt_committee_no_confidence_min, max: query.pvt_committee_no_confidence_max },
      pvt_hard_fork_initiation: { min: query.pvt_hard_fork_initiation_min, max: query.pvt_hard_fork_initiation_max },
      dvt_motion_no_confidence: { min: query.dvt_motion_no_confidence_min, max: query.dvt_motion_no_confidence_max },
      dvt_committee_normal: { min: query.dvt_committee_normal_min, max: query.dvt_committee_normal_max },
      dvt_committee_no_confidence: { min: query.dvt_committee_no_confidence_min, max: query.dvt_committee_no_confidence_max },
      dvt_update_to_constitution: { min: query.dvt_update_to_constitution_min, max: query.dvt_update_to_constitution_max },
      dvt_hard_fork_initiation: { min: query.dvt_hard_fork_initiation_min, max: query.dvt_hard_fork_initiation_max },
      dvt_p_p_network_group: { min: query.dvt_p_p_network_group_min, max: query.dvt_p_p_network_group_max },
      dvt_p_p_economic_group: { min: query.dvt_p_p_economic_group_min, max: query.dvt_p_p_economic_group_max },
      dvt_p_p_technical_group: { min: query.dvt_p_p_technical_group_min, max: query.dvt_p_p_technical_group_max },
      dvt_p_p_gov_group: { min: query.dvt_p_p_gov_group_min, max: query.dvt_p_p_gov_group_max },
      dvt_treasury_withdrawal: { min: query.dvt_treasury_withdrawal_min, max: query.dvt_treasury_withdrawal_max },
      committee_min_size: { min: query.committee_min_size_min, max: query.committee_min_size_max },
      committee_max_term_length: { min: query.committee_max_term_length_min, max: query.committee_max_term_length_max },
      gov_action_lifetime: { min: query.gov_action_lifetime_min, max: query.gov_action_lifetime_max },
      gov_action_deposit: { min: query.gov_action_deposit_min, max: query.gov_action_deposit_max },
      drep_deposit: { min: query.drep_deposit_min, max: query.drep_deposit_max },
      drep_activity: { min: query.drep_activity_min, max: query.drep_activity_max },
      pvtpp_security_group: { min: query.pvtpp_security_group_min, max: query.pvtpp_security_group_max },
      min_fee_ref_script_cost_per_byte: { min: query.min_fee_ref_script_cost_per_byte_min, max: query.min_fee_ref_script_cost_per_byte_max }
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
      SELECT *, encode(nonce, 'hex') AS nonce, encode(extra_entropy, 'hex') AS extra_entropy
      FROM epoch_param
      ${whereClause}
      ORDER BY id ${orderBy}
      LIMIT $${conditions.length + 1} OFFSET $${conditions.length + 2};
    `;

    console.log('Final query string:', queryString);
    console.log('Query values:', values);

    // Execute the query
    const epochParamRecords = await sql.unsafe(queryString, [...values, limit, offset]);

    // Return the results
    return epochParamRecords;
  } catch (err) {
    console.error('Error in /api/epoch_param:', err.message);
    return { error: err.message || 'An unexpected error occurred' };
  }
});