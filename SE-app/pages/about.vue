<script setup lang="ts">
useHead({
  title: 'About',
  meta: [
    { name: 'description', content: 'This is the about page for the Script Explorer' }
  ],
})
</script>

<template>
    <div class="grow" />
    <div class="flex-none w-96">
        <h2 class=" bg-white dark:bg-gray-900 tracking-tighter text-gray-500 md:text-lg dark:text-gray-300">
            About</h2>
        <br />

        <p class="text-justify text-gray-500 dark:text-gray-400">The Script-Explorer is a Frontend, which is suposed
            to reduce the precieved complexity of Smart Contracts. It strives to archive this goal by producing
            visual representations of the most relevant data.</p>
        <br />

        <p class="text-justify text-gray-500 dark:text-gray-400">Currently the Script-Explorer uses Sankey diagrams
            as its core means of visualizing Transactions and Addresss' Assets to UTxOs distributions.
            Also it uses dynamic symbols to signify complex state variables.However we will continue to find more
            ways, which make the complexities of the Blockchain more comprehensible for anyone interested.</p>
        <br />

        <p class="text-justify text-gray-500 dark:text-gray-400">If you would like to paritcipate in the development
            of the Script-Explorer you are very welcome.</p>
        <br />

        <p class="text-justify text-gray-500 dark:text-gray-400">Also feel free to contact us: </p>
        <a class="text-justify text-gray-900 dark:text-gray-200" href="mailto:info@script-explorer.com">info@script-explorer.com</a>
        <br />
    </div>
    <div class="grow" />

</template>