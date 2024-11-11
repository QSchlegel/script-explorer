<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-semibold mb-6 text-gray-800">Block Data</h1>
  
      <!-- Search Form -->
      <SearchForm :fields="filterFields" @submit="applyFilter" />
  
      <!-- Space between the search form and the table -->
      <div class="mt-8"></div>
  
      <!-- Block Table -->
      <TableView :headers="headers" :rows="blocks" :columns="columns" />
  
      <!-- Pagination Controls -->
      <div class="flex justify-between items-center mt-6">
        <button @click="prevPage" :disabled="page === 1" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50">Previous</button>
        <span>Page {{ page }}</span>
        <button @click="nextPage" :disabled="!hasNextPage" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50">Next</button>
      </div>
  
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
  
      <!-- Error Message -->
      <div v-if="error" class="mt-6 text-red-600 text-center font-semibold">{{ error }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import TableView from '~/components/tables/TableView.vue';
  import SearchForm from '~/components/forms/SearchForm.vue';
  
  // Define table headers and columns
  const headers = [
    'ID', 'Hash', 'Epoch No', 'Slot No', 'Epoch Slot No', 'Block No', 'Previous ID',
    'Slot Leader ID', 'Size', 'Time', 'TX Count', 'Proto Major', 'Proto Minor', 
    'VRF Key', 'Op Cert', 'Op Cert Counter'
  ];
  
  const columns = [
    'id', 'hash', 'epoch_no', 'slot_no', 'epoch_slot_no', 'block_no', 'previous_id', 
    'slot_leader_id', 'size', 'time', 'tx_count', 'proto_major', 'proto_minor', 
    'vrf_key', 'op_cert', 'op_cert_counter'
  ];
  
  // Reactive state to hold API data
  const blocks = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // Pagination state
  const page = ref(1);               // Current page
  const hasNextPage = ref(false);     // Check if there's a next page
  const resultsPerPage = ref(10);     // Results per page (default 10)
  const order = ref('desc');          // Order (default 'desc')
  
  // Filter fields for search form, defining which ones support min/max input
  const filterFields = reactive([
    { name: 'id', type: 'text', placeholder: 'Enter Block ID', showMinMax: true },
    { name: 'epoch_no', type: 'text', placeholder: 'Enter Epoch No', showMinMax: true },
    { name: 'slot_no', type: 'text', placeholder: 'Enter Slot No', showMinMax: true },
    { name: 'epoch_slot_no', type: 'text', placeholder: 'Enter Epoch Slot No', showMinMax: true },
    { name: 'block_no', type: 'text', placeholder: 'Enter Block No', showMinMax: true },
    { name: 'size', type: 'text', placeholder: 'Enter Block Size', showMinMax: true },
    { name: 'time', type: 'date', placeholder: 'Enter Date', showMinMax: false },
    { name: 'tx_count', type: 'text', placeholder: 'Enter TX Count', showMinMax: true }
  ]);
  
  // Fetch data from /api/blocks
  const fetchBlocks = async (filters = {}) => {
    loading.value = true;
    error.value = null;
  
    // Add pagination, results per page, and order parameters to the filters
    filters.limit = resultsPerPage.value;
    filters.offset = (page.value - 1) * resultsPerPage.value;
    filters.order = order.value;
  
    try {
      // Construct query string from filters
      const queryParams = new URLSearchParams(filters).toString();
  
      // Fetch data from the API
      const data = await $fetch(`/api/blocks?${queryParams}`);
      blocks.value = data;
  
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
    fetchBlocks(filters);
  };
  
  // Pagination: Move to the previous page
  const prevPage = () => {
    if (page.value > 1) {
      page.value--;
      fetchBlocks();
    }
  };
  
  // Pagination: Move to the next page
  const nextPage = () => {
    if (hasNextPage.value) {
      page.value++;
      fetchBlocks();
    }
  };
  
  // Fetch default block data on page load
  onMounted(() => {
    fetchBlocks(); // Fetch without filters initially
  });
  </script>