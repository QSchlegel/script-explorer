<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-semibold mb-6 text-gray-800">Extra Key Witness Data</h1>
  
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
  
      <!-- Extra Key Witness Table -->
      <TableView v-if="!loading" :headers="headers" :rows="extraKeyWitnessRecords" :columns="columns" />
  
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
  
  const headers = ['ID', 'Hash', 'Transaction ID'];
  const columns = ['id', 'hash', 'tx_id'];
  
  // Reactive state for API data
  const extraKeyWitnessRecords = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  const page = ref(1);               // Current page
  const hasNextPage = ref(false);     // Next page availability
  const resultsPerPage = ref(10);     // Results per page
  const order = ref('desc');          // Order (default 'desc')
  
  // Filter fields for search form
  const filterFields = reactive([
    { name: 'id', type: 'text', placeholder: 'Enter ID', showMinMax: true },
    { name: 'hash', type: 'text', placeholder: 'Enter Hash' },
    { name: 'tx_id', type: 'text', placeholder: 'Enter Transaction ID' }
  ]);
  
  // Fetch data from /api/extra_key_witness
  const fetchExtraKeyWitnessRecords = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    filters.limit = resultsPerPage.value;
    filters.offset = (page.value - 1) * resultsPerPage.value;
    filters.order = order.value;
  
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const data = await $fetch(`/api/extra_key_witness?${queryParams}`);
      extraKeyWitnessRecords.value = data;
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
    fetchExtraKeyWitnessRecords(filters);
  };
  
  const clearAllFields = () => {
    filterFields.forEach(field => field.value = '');
    applyFilter({});
  };
  
  const prevPage = () => {
    if (page.value > 1) {
      page.value--;
      fetchExtraKeyWitnessRecords();
    }
  };
  
  const nextPage = () => {
    if (hasNextPage.value) {
      page.value++;
      fetchExtraKeyWitnessRecords();
    }
  };
  
  onMounted(() => {
    fetchExtraKeyWitnessRecords();
  });
  </script>