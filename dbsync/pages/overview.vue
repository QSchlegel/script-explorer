<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">Database Tables & API Documentation</h1>
  
      <div v-if="error" class="text-red-500 mb-6">Error loading OpenAPI spec: {{ error }}</div>
      <div v-if="loading" class="text-gray-500">Loading API Documentation...</div>
  
      <!-- Dynamic Item Grid -->
      <div v-if="!loading && openApiData" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(item, path) in getApiPaths()" 
          :key="path" 
          :class="['bg-white shadow-md rounded-lg p-4 hover:bg-gray-50 transition-all', { 'col-span-full': isExpanded(path) }]"
        >
          <!-- Title as a NuxtLink to the table search page -->
          <h3 class="text-lg font-semibold text-blue-600 hover:underline mb-2">
            <NuxtLink :to="getTableRoute(path)" class="focus:outline-none">
              {{ item.title || path }}
            </NuxtLink>
          </h3>
          <p class="text-sm text-gray-600 mb-4">{{ item.summary || 'No summary available' }}</p>
  
          <!-- Show/Hide Spec Button -->
          <button 
            @click="toggleSpec(path)" 
            class="text-sm text-blue-500 hover:underline focus:outline-none"
          >
            {{ isExpanded(path) ? 'Hide API Spec' : 'Show API Spec' }}
          </button>
  
          <!-- Subtle Search Table Button with blue text and outline -->
          <NuxtLink
            :to="getTableRoute(path)"
            class="px-4 py-2 mt-2 block text-center rounded border border-blue-600 text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search Table
          </NuxtLink>
  
          <!-- Collapsible OpenApiSpec Component -->
          <OpenApiSpec 
            v-if="isExpanded(path)" 
            :spec="item" 
            class="mt-4" 
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import yaml from 'js-yaml';
  import OpenApiSpec from '~/components/OpenApiSpec.vue';
  
  const openApiData = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const expandedPaths = reactive({});  // Stores expanded state of each path
  
  // Fetch and parse the openapi.yaml file
  onMounted(async () => {
    try {
      const response = await fetch('/openapi.yaml');
      if (!response.ok) throw new Error('Failed to fetch OpenAPI spec');
  
      const yamlText = await response.text();
      openApiData.value = yaml.load(yamlText);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });
  
  // Toggle the expanded state of a specific path
  const toggleSpec = (path) => {
    expandedPaths[path] = !expandedPaths[path];
  };
  
  // Check if a specific path's API spec is expanded
  const isExpanded = (path) => expandedPaths[path] || false;
  
  // Extract paths and their details
  const getApiPaths = () => {
    if (!openApiData.value || !openApiData.value.paths) return {};
  
    return Object.entries(openApiData.value.paths).reduce((acc, [path, methods]) => {
      // Extract the first method's summary and description
      const firstMethod = Object.values(methods)[0];
      acc[path] = {
        title: firstMethod.operationId || path,  // Use operationId as title if available
        summary: firstMethod.summary,
        description: firstMethod.description,
        methods,  // Pass all methods to `OpenApiSpec` for detailed display
      };
      return acc;
    }, {});
  };
  
  // Function to generate the table route
  const getTableRoute = (path) => {
    const tableName = path.replace('/', '');
    return `/viewer/${tableName}`;
  };
  </script>
  
  <style scoped>
  /* Style for collapsible full-row display */
  .grid {
    display: grid;
  }
  
  .grid div {
    border: 1px solid #e2e8f0;
    transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  
  .grid div:hover {
    background-color: #f9fafb;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  button {
    color: #3b82f6;
  }
  
  button:hover {
    color: #2563eb;
  }
  
  .nuxt-link {
    color: #3b82f6;
    text-decoration: none;
  }
  
  .nuxt-link:hover {
    text-decoration: underline;
  }
  
  .nuxt-link-active {
    font-weight: bold;
  }
  
  .nuxt-link-exact-active {
    font-weight: bold;
  }
  
  /* Custom button style for "Search Table" */
  .nuxt-link {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background-color: transparent;
    color: #3b82f6;  /* Blue text */
    border: 1px solid #3b82f6;  /* Blue outline */
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  }
  
  .nuxt-link:hover {
    background-color: #e0f2fe;  /* Light blue hover effect */
    color: #2563eb;  /* Slightly darker blue text on hover */
  }
  </style>