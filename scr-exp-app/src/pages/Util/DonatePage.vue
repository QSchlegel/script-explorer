<script setup>
import CopyToClipboard from 'src/components/Util/CopyToClipboard.vue';
</script>
<template>
    <q-page>
        <h2 class="text-center">Script-Explorer</h2>
        <div class="row q-px-xl">
            <div class="col-auto col-sm-2 col-md-4 col-lg-5"/>
            <div class="col-11 col-sm-8 col-md-4 col-lg-2" >
                <section>Hi, if you appreciate the work we have put in to create the Script-Explorer, we would be very greateful if you left a tip in the Form of Ada.</section>
                <section>This is our address: </section>
                <CopyToClipboard 
                    :content="'addr1q8evwwefrpj8w0rjvn4uuf2zw3v3cwd2rtk3342rvzguqc5ls7k7sa4mqq653kyv0fk00ga8zgqj6uku3epdvpf7vmjqrkvv20'"
                    :start-offset="10"
                    :end-offset="10"
                    :btn-size="'xs'" />
            </div>
            <div class="col-auto col-sm-2 col-md-4 col-lg-5"/>
        </div>
    </q-page>
</template>