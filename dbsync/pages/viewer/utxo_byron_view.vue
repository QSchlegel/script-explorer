<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-semibold mb-6 text-gray-800">UTXO Byron View Records</h1>
  
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
  
      <!-- UTXO Byron View Table -->
      <TableView v-if="!loading" :headers="headers" :rows="utxoByronRecords" :columns="columns" />
  
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
  
  const headers = ['ID', 'Tx ID', 'Index', 'Address', 'Has Script', 'Payment Cred', 'Stake Address ID', 'Value', 'Data Hash', 'Inline Datum ID', 'Reference Script ID'];
  const columns = ['id', 'tx_id', 'index', 'address', 'address_has_script', 'payment_cred', 'stake_address_id', 'value', 'data_hash', 'inline_datum_id', 'reference_script_id'];
  
  // Reactive state for API data
  const utxoByronRecords = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  const page = ref(1);               // Current page
  const hasNextPage = ref(false);     // Next page availability
  const resultsPerPage = ref(10);     // Results per page
  const order = ref('desc');          // Order (default 'desc')
  
  // Filter fields for search form
  const filterFields = reactive([
    { name: 'id', type: 'text', placeholder: 'Enter ID', showMinMax: true },
    { name: 'tx_id', type: 'text', placeholder: 'Enter Tx ID' },
    { name: 'index', type: 'text', placeholder: 'Enter Index' },
    { name: 'address', type: 'text', placeholder: 'Enter Address' },
    { name: 'address_has_script', type: 'checkbox', label: 'Has Script' },
    { name: 'payment_cred', type: 'text', placeholder: 'Enter Payment Cred' },
    { name: 'stake_address_id', type: 'text', placeholder: 'Enter Stake Address ID' },
    { name: 'value', type: 'text', placeholder: 'Enter Value', showMinMax: true },
    { name: 'data_hash', type: 'text', placeholder: 'Enter Data Hash' },
    { name: 'inline_datum_id', type: 'text', placeholder: 'Enter Inline Datum ID' },
    { name: 'reference_script_id', type: 'text', placeholder: 'Enter Reference Script ID' }
  ]);
  
  // Fetch data from /api/utxo_byron_view
  const fetchUtxoByronRecords = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    filters.limit = resultsPerPage.value;
    filters.offset = (page.value - 1) * resultsPerPage.value;
    filters.order = order.value;
  
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const data = await $fetch(`/api/utxo_byron_view?${queryParams}`);
      utxoByronRecords.value = data;
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
    fetchUtxoByronRecords(filters);
  };
  
  const clearAllFields = () => {
    filterFields.forEach(field => field.value = '');
    applyFilter({});
  };
  
  const prevPage = () => {
    if (page.value > 1) {
      page.value--;
      fetchUtxoByronRecords();
    }
  };
  
  const nextPage = () => {
    if (hasNextPage.value) {
      page.value++;
      fetchUtxoByronRecords();
    }
  };
  
  onMounted(() => {
    fetchUtxoByronRecords();
  });
  </script>