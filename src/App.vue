<template>
  <v-app>
    <AppBar />
    <ItemNav v-if="this.$route.name == 'Item'" />
    <v-main>
      <router-view />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
import AppBar from './components/common/AppBar.vue';
import ItemNav from '@/components/item/ItemNav.vue';
import AppFooter from './components/common/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppBar,
    ItemNav,
    AppFooter,
  },
};
</script>

<style>
@import './assets/css/styles.css';
</style>
