<template>
  <Navber />
  <div class="container">
    <router-view />
  </div>
  <Toast />
</template>

<script>
import Toast from '@/components/Toast.vue';
import Navber from '@/components/Navbar.vue';

export default {
  components: {
    Toast,
    Navber,
  },
};
</script>

<style>
  
</style>