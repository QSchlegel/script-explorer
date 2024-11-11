<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-semibold mb-6 text-gray-800">Tx Out Data</h1>
  
      <!-- Search Form -->
      <SearchForm :fields="filterFields" @submit="applyFilter" @clear="clearAllFields" />
  
      <!-- Space between the search form and the table -->
      <div class="mt-8"></div>
  
      <!-- Loading Indicator -->
      <div v-if="loading" class="mt-6 flex justify-center">
        <svg
          class="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
  
      <!-- Tx Out Table -->
      <TableView v-if="!loading" :headers="headers" :rows="txOuts" :columns="columns" />
  
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
  
  // Define table headers and columns for tx_out table
  const headers = [
    'ID', 'Tx ID', 'Index', 'Address', 'Has Script', 'Value', 'Stake Address ID',
    'Payment Cred', 'Data Hash', 'Inline Datum ID', 'Reference Script ID'
  ];
  
  const columns = [
    'id', 'tx_id', 'index', 'address', 'address_has_script', 'value', 'stake_address_id',
    'payment_cred', 'data_hash', 'inline_datum_id', 'reference_script_id'
  ];
  
  // Reactive state to hold API data
  const txOuts = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // Pagination state
  const page = ref(1);               // Current page
  const hasNextPage = ref(false);     // Check if there's a next page
  const resultsPerPage = ref(10);     // Results per page (default 10)
  const order = ref('desc');          // Order (default 'desc')
  
  // Filter fields for search form, including the new range fields for id, tx_id, and value
  const filterFields = reactive([
    { name: 'id', type: 'text', placeholder: 'Enter Tx Out ID', showMinMax: true },
    { name: 'tx_id', type: 'text', placeholder: 'Enter Tx ID', showMinMax: true },
    { name: 'index', type: 'text', placeholder: 'Enter Index', showMinMax: true },
    { name: 'value', type: 'text', placeholder: 'Enter Value', showMinMax: true },
    { name: 'stake_address_id', type: 'text', placeholder: 'Enter Stake Address ID', showMinMax: true },
    { name: 'address', type: 'text', placeholder: 'Enter Address', showMinMax: false },
    { name: 'payment_cred', type: 'text', placeholder: 'Enter Payment Cred', showMinMax: false },
    { name: 'data_hash', type: 'text', placeholder: 'Enter Data Hash', showMinMax: false },
  ]);
  
  // Fetch data from /api/tx_out
  const fetchTxOuts = async (filters = {}) => {
    loading.value = true;
    error.value = null;
  
    // Add pagination, results per page, and order parameters to the filters
    filters.limit = resultsPerPage.value;
    filters.offset = (page.value - 1) * resultsPerPage.value;
  
    // Only add the order parameter when range search is not enabled
    if (!filters.rangeSearch) {
      filters.order = order.value;
    }
  
    try {
      // Construct query string from filters
      const queryParams = new URLSearchParams(filters).toString();
  
      // Fetch data from the API
      const data = await $fetch(`/api/tx_out?${queryParams}`);
      txOuts.value = data;
  
      // Check if we have more pages (if results are less than the limit, it's the last page)
      hasNextPage.value = data.length === resultsPerPage.value;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  
  // Apply filters when the search form is submitted
  const applyFilter = (filters) => {
    page.value = 1;  // Reset to first page when applying a new filter
    resultsPerPage.value = parseInt(filters.resultsPerPage) || 10;
    order.value = filters.order || 'desc';
    fetchTxOuts(filters);
  };
  
  // Clear all fields when the clear button is clicked
  const clearAllFields = () => {
    filterFields.forEach(field => {
      filterFields[field.name] = ''; // Reset each field value to empty
    });
    applyFilter({}); // Fetch all data with empty filters
  };
  
  // Pagination: Move to the previous page
  const prevPage = () => {
    if (page.value > 1) {
      page.value--;
      fetchTxOuts();
    }
  };
  
  // Pagination: Move to the next page
  const nextPage = () => {
    if (hasNextPage.value) {
      page.value++;
      fetchTxOuts();
    }
  };
  
  // Fetch default transaction data on page load
  onMounted(() => {
    fetchTxOuts(); // Fetch without filters initially
  });
  </script>