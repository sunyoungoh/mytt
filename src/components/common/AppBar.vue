<template>
  <v-app-bar app color="white" elevation="0">
    <div class="d-flex align-center">
      <router-link
        to="/"
        @click.native="reload"
        class="text-decoration-none black--text"
      >
        <h3 class="logo">tenbyten product</h3>
      </router-link>
    </div>
    <v-spacer></v-spacer>
    <div class="btns">
      <v-btn
        v-if="$store.getters.isLogin"
        text
        plain
        class="px-0"
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
        class="px-0"
        color="black"
        :ripple="false"
        to="/login"
      >
        로그인
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({ path: '/login' });
    },
    reload() {
      if (this.$route.path == '/') {
        this.$router.go(0);
      }
    },
  },
};
</script>

<style></style>
