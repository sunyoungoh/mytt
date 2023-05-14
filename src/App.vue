<template>
  <v-app>
    <AppBar />
    <v-main>
      <router-view />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
import AppBar from './components/AppBar.vue';
import AppFooter from './components/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppBar,
    AppFooter,
  },
};
</script>

<style>
@import './assets/css/styles.css';
</style>
