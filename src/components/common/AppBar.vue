<template>
  <v-app-bar app color="white" elevation="0" height="56">
    <div class="d-flex align-center">
      <router-link
        to="/"
        @click.native="reload"
        class="text-decoration-none black--text"
      >
        <h3 class="logo">MYTT</h3>
      </router-link>
    </div>
    <nav class="ml-3">
      <router-link to="/" class="text-decoration-none pa-2"> 홈 </router-link>
      <router-link
        v-if="$store.getters.isDigitalAuthor"
        to="/order"
        class="text-decoration-none pa-2"
      >
        주문내역
      </router-link>
    </nav>
    <v-spacer></v-spacer>
    <div class="btns">
      <router-link
        v-if="$store.getters.isLogin"
        text
        plain
        class="text-decoration-none px-0 py-2"
        color="black"
        :ripple="false"
        to="/mypage"
      >
        마이페이지
      </router-link>
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
    reload() {
      if (this.$route.path == '/') {
        this.$router.go(0);
      }
    },
  },
};
</script>

<style></style>
