<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar.vue';

export default {
  name: 'App',
  components: {
    AppBar,
  },
  data: () => ({
    //
  }),
};
</script>

<style>
@import './assets/css/styles.css';
</style>
