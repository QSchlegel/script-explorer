<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-semibold mb-6 text-gray-800">Epoch Parameter Data</h1>
  
      <!-- Search Form -->
      <SearchForm :fields="filterFields" @submit="applyFilter" @clear="clearAllFields" />
  
      <!-- Space between the search form and the table -->
      <div class="mt-8"></div>
  
      <!-- Loading Indicator -->
      <div v-if="loading" class="mt-6 flex justify-center">
        <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>
  
      <!-- Epoch Parameter Table -->
      <TableView v-if="!loading" :headers="headers" :rows="epochParamRecords" :columns="columns" />
  
      <!-- Pagination Controls -->
      <div class="flex justify-between items-center mt-6">
        <button @click="prevPage" :disabled="page === 1" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50">Previous</button>
        <span>Page {{ page }}</span>
        <button @click="nextPage" :disabled="!hasNextPage" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50">Next</button>
      </div>
  
      <!-- Error Message -->
      <div v-if="error" class="mt-6 text-red-600 text-center font-semibold">{{ error }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import TableView from '~/components/tables/TableView.vue';
  import SearchForm from '~/components/forms/SearchForm.vue';
  
  const headers = [
    'ID', 'Epoch No', 'Min Fee A', 'Min Fee B', 'Max Block Size', 'Max Tx Size', 
    'Max BH Size', 'Key Deposit', 'Pool Deposit', 'Max Epoch', 'Optimal Pool Count', 
    'Influence', 'Monetary Expand Rate', 'Treasury Growth Rate', 'Decentralisation',
    'Protocol Major', 'Protocol Minor', 'Min UTXO Value', 'Min Pool Cost', 'Nonce', 
    'Cost Model ID', 'Price Mem', 'Price Step', 'Max Tx Ex Mem', 'Max Tx Ex Steps',
    'Max Block Ex Mem', 'Max Block Ex Steps', 'Max Val Size', 'Collateral Percent',
    'Max Collateral Inputs', 'Block ID', 'Extra Entropy', 'Coins Per UTXO Size',
    'PVT Motion No Confidence', 'PVT Committee Normal', 'PVT Committee No Confidence',
    'PVT Hard Fork Initiation', 'DVT Motion No Confidence', 'DVT Committee Normal',
    'DVT Committee No Confidence', 'DVT Update to Constitution', 'DVT Hard Fork Initiation',
    'DVT P P Network Group', 'DVT P P Economic Group', 'DVT P P Technical Group',
    'DVT P P Gov Group', 'DVT Treasury Withdrawal', 'Committee Min Size',
    'Committee Max Term Length', 'Gov Action Lifetime', 'Gov Action Deposit', 
    'Drep Deposit', 'Drep Activity', 'PVT P P Security Group', 'Min Fee Ref Script Cost Per Byte'
  ];
  const columns = [
    'id', 'epoch_no', 'min_fee_a', 'min_fee_b', 'max_block_size', 'max_tx_size', 
    'max_bh_size', 'key_deposit', 'pool_deposit', 'max_epoch', 'optimal_pool_count', 
    'influence', 'monetary_expand_rate', 'treasury_growth_rate', 'decentralisation',
    'protocol_major', 'protocol_minor', 'min_utxo_value', 'min_pool_cost', 'nonce', 
    'cost_model_id', 'price_mem', 'price_step', 'max_tx_ex_mem', 'max_tx_ex_steps',
    'max_block_ex_mem', 'max_block_ex_steps', 'max_val_size', 'collateral_percent',
    'max_collateral_inputs', 'block_id', 'extra_entropy', 'coins_per_utxo_size',
    'pvt_motion_no_confidence', 'pvt_committee_normal', 'pvt_committee_no_confidence',
    'pvt_hard_fork_initiation', 'dvt_motion_no_confidence', 'dvt_committee_normal',
    'dvt_committee_no_confidence', 'dvt_update_to_constitution', 'dvt_hard_fork_initiation',
    'dvt_p_p_network_group', 'dvt_p_p_economic_group', 'dvt_p_p_technical_group',
    'dvt_p_p_gov_group', 'dvt_treasury_withdrawal', 'committee_min_size',
    'committee_max_term_length', 'gov_action_lifetime', 'gov_action_deposit', 
    'drep_deposit', 'drep_activity', 'pvtpp_security_group', 'min_fee_ref_script_cost_per_byte'
  ];
  
  // Reactive state for API data
  const epochParamRecords = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  const page = ref(1);               // Current page
  const hasNextPage = ref(false);     // Next page availability
  const resultsPerPage = ref(10);     // Results per page
  const order = ref('desc');          // Order (default 'desc')
  
  // Filter fields for search form
  const filterFields = reactive([
    { name: 'id', type: 'text', placeholder: 'Enter ID', showMinMax: true },
    { name: 'epoch_no', type: 'text', placeholder: 'Enter Epoch No', showMinMax: true },
    { name: 'min_fee_a', type: 'text', placeholder: 'Enter Min Fee A', showMinMax: true },
    { name: 'min_fee_b', type: 'text', placeholder: 'Enter Min Fee B', showMinMax: true },
    { name: 'max_block_size', type: 'text', placeholder: 'Enter Max Block Size', showMinMax: true },
    { name: 'key_deposit', type: 'text', placeholder: 'Enter Key Deposit', showMinMax: true },
    // Add fields for all additional filters here...
  ]);
  
  // Fetch data from /api/epoch_param
  const fetchEpochParamRecords = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    filters.limit = resultsPerPage.value;
    filters.offset = (page.value - 1) * resultsPerPage.value;
    filters.order = order.value;
  
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const data = await $fetch(`/api/epoch_param?${queryParams}`);
      epochParamRecords.value = data;
      hasNextPage.value = data.length === resultsPerPage.value;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  
  const applyFilter = (filters) => {
    page.value = 1;
    resultsPerPage.value = parseInt(filters.resultsPerPage) || 10;
    order.value = filters.order || 'desc';
    fetchEpochParamRecords(filters);
  };
  
  const clearAllFields = () => {
    filterFields.forEach(field => field.value = '');
    applyFilter({});
  };
  
  const prevPage = () => {
    if (page.value > 1) {
      page.value--;
      fetchEpochParamRecords();
    }
  };
  
  const nextPage = () => {
    if (hasNextPage.value) {
      page.value++;
      fetchEpochParamRecords();
    }
  };
  
  onMounted(() => {
    fetchEpochParamRecords();
  });
  </script>