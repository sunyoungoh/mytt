<template>
  <LoginForm />
</template>

<script>
import LoginForm from '@/components/login/LoginForm.vue';

export default {
  components: {
    LoginForm,
  },
  mounted() {
    if (this.$store.getters.isLogin) {
      this.$router.push({ path: '/' });
    }
  },
};
</script>

<style></style>
