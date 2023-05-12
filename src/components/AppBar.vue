<template>
  <v-app-bar app color="white" elevation="0">
    <div class="d-flex align-center">
      <router-link to="/" class="text-decoration-none black--text">
        <h3>tenbyten product</h3>
      </router-link>
    </div>
    <v-spacer></v-spacer>
    <v-btn
      v-if="$store.getters.isLogin"
      text
      plain
      class="pr-0"
      color="black"
      :ripple="false"
      to="/login"
      @click="logout"
    >
      로그아웃
    </v-btn>
    <v-btn
      v-else
      text
      plain
      class="pr-0"
      color="black"
      :ripple="false"
      to="/login"
    >
      로그인
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
  },
};
</script>

<style>
.v-toolbar__content {
  border-bottom: 1px solid #e7e7e7 !important;
}
</style>
