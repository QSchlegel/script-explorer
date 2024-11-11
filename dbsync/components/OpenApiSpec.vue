<template>
    <div class="bg-gray-100 rounded-lg p-4">
      <!-- Title remains a link to the table search page -->
      <h4 class="text-md font-semibold mb-2 text-gray-800">
        <NuxtLink :to="tableRoute" class="text-blue-600 hover:underline">{{ spec.title }}</NuxtLink>
      </h4>
      <p class="text-sm text-gray-600 mb-4">{{ spec.description || 'No description available' }}</p>
  
      <!-- Methods Display -->
      <div v-for="(details, method) in spec.methods" :key="method" class="mb-4">
        <p class="font-semibold text-blue-500">{{ method.toUpperCase() }}:</p>
        <p class="text-sm text-gray-600 mb-2"><strong>Summary:</strong> {{ details.summary || 'No summary available' }}</p>
        <p class="text-sm text-gray-600 mb-2"><strong>Description:</strong> {{ details.description || 'No description available' }}</p>
  
        <!-- Example parameters, requestBody, responses, etc. -->
        <div v-if="details.parameters && details.parameters.length" class="mb-2">
          <p class="text-sm font-semibold text-gray-700">Parameters:</p>
          <ul>
            <li v-for="param in details.parameters" :key="param.name" class="text-sm text-gray-600">
              <strong>{{ param.name }}</strong> ({{ param.in }}): {{ param.description || 'No description' }}
            </li>
          </ul>
        </div>
  
        <div v-if="details.requestBody && details.requestBody.content" class="mb-2">
          <p class="text-sm font-semibold text-gray-700">Request Body:</p>
          <p class="text-sm text-gray-600">{{ details.requestBody.description || 'No description available' }}</p>
        </div>
  
        <div v-if="details.responses && Object.keys(details.responses).length" class="mb-2">
          <p class="text-sm font-semibold text-gray-700">Responses:</p>
          <ul>
            <li v-for="(response, code) in details.responses" :key="code" class="text-sm text-gray-600">
              <strong>{{ code }}:</strong> {{ response.description || 'No description available' }}
            </li>
          </ul>
        </div>
  
        <!-- Curl command generation -->
        <div class="my-4">
          <p class="font-semibold">Generated Curl Command:</p>
          <pre class="bg-gray-200 p-2 rounded">{{ generateCurlCommand(method, details) }}</pre>
        </div>
  
        <!-- Execute Curl Command Button with subtle styling -->
        <button
          @click="executeCurlCommand(method, details)"
          class="px-4 py-2 mt-2 block text-center rounded border border-blue-600 text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Execute Curl Command
        </button>
  
        <!-- Display Response -->
        <div v-if="showResponse" class="mt-4">
          <h4 class="font-semibold text-gray-700">API Response:</h4>
          <textarea
            class="w-full h-40 p-2 mt-2 border rounded"
            readonly
          >{{ apiResponse }}</textarea>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRuntimeConfig } from '#app';  // Use Nuxt's runtime config
  
  // Get the API base URL from the runtime config
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  
  const props = defineProps({
    spec: {
      type: Object,
      required: true
    }
  });
  
  const apiResponse = ref('');
  const showResponse = ref(false);
  
  // Computed route to the table's dedicated search page (e.g., /tx)
  const tableRoute = computed(() => {
    return props.spec.title;
  });
  
  // Updated curl command generation for conditional /tx prefix
  const generateCurlCommand = (method, details) => {
    let path = props.spec.title;
  
    const fullPath = `/api${path}`;
    let curlCommand = `curl -X ${method.toUpperCase()} "${apiBaseUrl}${fullPath}"`;
  
    return curlCommand;
  };
  
  const executeCurlCommand = async (method, details) => {
    let path = props.spec.title;
  
    const fullPath = `/api${path}`;
    const url = `${apiBaseUrl}${fullPath}`;
  
    const options = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    if (method === 'post' && details.requestBody) {
      options.body = JSON.stringify({ key: 'value' });
    }
  
    try {
      const response = await fetch(url, options);
      const data = await response.text();
      apiResponse.value = data;
      showResponse.value = true;
    } catch (error) {
      apiResponse.value = `Error: ${error.message}`;
      showResponse.value = true;
    }
  };
  </script>
  
  <style scoped>
  /* Custom button style for "Execute Curl Command" to match "Search Table" */
  button {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background-color: transparent;
    color: #3b82f6;  /* Blue text */
    border: 1px solid #3b82f6;  /* Blue outline */
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  }
  
  button:hover {
    background-color: #e0f2fe;  /* Light blue hover effect */
    color: #2563eb;  /* Slightly darker blue text on hover */
  }
  </style>