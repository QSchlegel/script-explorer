<template>
    <!-- Outer container adjusts to full width only on large screens (xl and above) -->
    <div class="px-4 sm:px-6 lg:px-8 py-8 xl:max-w-full">
      <h1 class="text-2xl font-semibold mb-6 text-gray-800">Tx Metadata</h1>
  
      <!-- Search Form remains the same -->
      <SearchForm :fields="filterFields" @submit="applyFilter" @clear="clearAllFields" />
  
      <div class="mt-8"></div>
  
      <!-- Loading Indicator -->
      <div v-if="loading" class="mt-6 flex justify-center">
        <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      </div>
  
      <!-- Tx Metadata Table expands to full width only on larger screens (xl and above) -->
      <TableView v-if="!loading" class="w-full xl:w-full" :headers="headers" :rows="txMetadata" :columns="columns" />
  
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
  
  <style scoped>
  /* Only apply on screens that are xl (1280px) and above */
  @media (min-width: 1280px) {
    .table-container {
      padding: 0.5rem 1rem; /* Reduce padding for a tighter look */
    }
    .table-cell {
      padding: 0.5rem; /* Make table cells more compact */
    }
  }

  /* Default styling for smaller screens */
  .table-container {
    padding: 1rem; /* Standard padding for smaller screens */
  }
</style>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import TableView from '~/components/tables/TableView.vue';
  import SearchForm from '~/components/forms/SearchForm.vue';
  
  // Define table headers and columns for tx_metadata table
  const headers = ['ID', 'Key', 'JSON', 'Bytes', 'Tx ID'];
  const columns = ['id', 'key', 'json', 'bytes', 'tx_id'];
  
  // Reactive state for tx_metadata data
  const txMetadata = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // Pagination state
  const page = ref(1);
  const hasNextPage = ref(false);
  const resultsPerPage = ref(10);
  const order = ref('desc');
  
  // Filter fields for search form, including the new range fields for id, key, and tx_id
  const filterFields = reactive([
    { name: 'id', type: 'text', placeholder: 'Enter Metadata ID', showMinMax: true },
    { name: 'key', type: 'text', placeholder: 'Enter Key', showMinMax: true },
    { name: 'tx_id', type: 'text', placeholder: 'Enter Tx ID', showMinMax: true }
  ]);
  
  // Fetch data from /api/tx_metadata
  const fetchTxMetadata = async (filters = {}) => {
    loading.value = true;
    error.value = null;
  
    // Add pagination, results per page, and order parameters to the filters
    filters.limit = resultsPerPage.value;
    filters.offset = (page.value - 1) * resultsPerPage.value;
    if (!filters.rangeSearch) {
      filters.order = order.value;
    }
  
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const data = await $fetch(`/api/tx_metadata?${queryParams}`);
      txMetadata.value = data;
      hasNextPage.value = data.length === resultsPerPage.value;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  
  // Apply filters when the search form is submitted
  const applyFilter = (filters) => {
    page.value = 1;
    resultsPerPage.value = parseInt(filters.resultsPerPage) || 10;
    order.value = filters.order || 'desc';
    fetchTxMetadata(filters);
  };
  
  // Clear all fields when the clear button is clicked
  const clearAllFields = () => {
    filterFields.forEach(field => {
      filterFields[field.name] = '';
    });
    applyFilter({});
  };
  
  // Pagination: Move to the previous page
  const prevPage = () => {
    if (page.value > 1) {
      page.value--;
      fetchTxMetadata();
    }
  };
  
  // Pagination: Move to the next page
  const nextPage = () => {
    if (hasNextPage.value) {
      page.value++;
      fetchTxMetadata();
    }
  };
  
  // Fetch initial data on page load
  onMounted(() => {
    fetchTxMetadata();
  });
  </script>