<template>
  <LoginForm />
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

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
