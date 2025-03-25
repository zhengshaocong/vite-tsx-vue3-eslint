<template>
  <div class="container">
    <!-- <nav class="nav">智慧管养一体化平台</nav> -->
    <BreadCrumb :items="navigation" v-model:active="active" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import BreadCrumb from '@/components/BreadCrumb.vue'
  import { navigation } from '@/assets/config/navigation'
  const active = ref(0)
</script>

<style scoped>
  .container {
    background-image: url('@/assets/backgroundImage.jpg');
  }
  .nav {
    padding: 50px 0;
    text-align: center;
    font-size: 41px;
    color: #fff;
    margin-bottom: 8%;
  }
</style>
