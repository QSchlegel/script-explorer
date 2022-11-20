<script setup>
import LoginView from 'src/components/Util/LoginView.vue';
import SearchView from 'src/components/Util/SearchView.vue';
import FooterView from 'src/components/Util/FooterView.vue';

</script>

<template>
  <q-page>
    <!--Title-->
    <div class="q-pt-xl q-mt-xl">
      <h2 class="text-center q-mt-xl">
        Script-Explorer
      </h2>
    </div>

    <LoginView />

    <SearchView />
    
    <FooterView />
  </q-page>
</template>