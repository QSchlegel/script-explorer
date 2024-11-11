<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- Form Fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="field in fields" :key="field.name" class="flex flex-col">
        <label :for="field.name" class="mb-1 font-medium text-gray-700">
          {{ field.placeholder }}
        </label>

        <!-- Show Exact Input by Default -->
        <input
          v-if="!enableRangeSearch || !field.showMinMax"
          :id="field.name"
          v-model="form[field.name]"
          :type="field.type"
          :placeholder="field.placeholder"
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Show Range Inputs (From/To) if Range Search is Enabled -->
        <div v-else>
          <input
            :id="`from_${field.name}`"
            v-model="form[`min_${field.name}`]"
            type="number"
            :placeholder="`From ${field.placeholder}`"
            class="px-4 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            :id="`to_${field.name}`"
            v-model="form[`max_${field.name}`]"
            type="number"
            :placeholder="`To ${field.placeholder}`"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Results per Page Selector -->
    <div class="flex flex-col mt-4">
      <label for="resultsPerPage" class="mb-1 font-medium text-gray-700">Results per Page</label>
      <select id="resultsPerPage" v-model="form.resultsPerPage" class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="10">10</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>

    <!-- Order Toggle (Ascending/Descending) - Visible only when Range Search is Disabled -->
    <div class="flex flex-col mt-4" v-if="!enableRangeSearch">
      <label for="order" class="mb-1 font-medium text-gray-700">Order</label>
      <select id="order" v-model="form.order" class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <!-- Buttons (Search, Clear All, and Range Toggle) -->
    <div class="flex justify-between items-center mt-4">
      <div class="flex items-center space-x-4">
        <button
          type="button"
          @click="clearForm"
          class="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Clear All
        </button>
        <label class="flex items-center space-x-2">
          <span class="font-medium text-gray-700">Range Search</span>
          <input 
            type="checkbox" 
            v-model="enableRangeSearch" 
            class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </label>
      </div>
      <button
        type="submit"
        class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Search
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';

// Props for accepting form fields dynamically
const props = defineProps({
  fields: {
    type: Array,
    default: () => []
  }
});

// Reactive state for form and range toggle
const form = reactive({});
const enableRangeSearch = ref(false);

// Initialize the form object based on the fields passed
props.fields.forEach(field => {
  form[field.name] = '';           // Initialize the form fields
  form[`min_${field.name}`] = '';  // Initialize min fields
  form[`max_${field.name}`] = '';  // Initialize max fields
});

// Emit form data back to the parent on submit
const emit = defineEmits(['submit', 'clear']);
const onSubmit = () => {
  let cleanedForm = {};

  // If Range Search is enabled, use min/max fields
  if (enableRangeSearch.value) {
    cleanedForm = Object.fromEntries(
      Object.entries(form).filter(([key, value]) => (key.startsWith('min_') || key.startsWith('max_')) && value !== '')
    );
  } else {
    // Otherwise, send exact values
    cleanedForm = Object.fromEntries(
      Object.entries(form).filter(([key, value]) => !key.startsWith('min_') && !key.startsWith('max_') && value !== '')
    );
  }

  emit('submit', cleanedForm);
};

// Emit an event to clear the form fields
const clearForm = () => {
  props.fields.forEach(field => {
    form[field.name] = '';           // Clear exact fields
    form[`min_${field.name}`] = '';  // Clear min fields
    form[`max_${field.name}`] = '';  // Clear max fields
  });
  emit('clear'); // Emit clear event to the parent
};
</script>