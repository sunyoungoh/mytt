<template>
  <button
    :class="result"
    :disabled="result !== '' || loading"
    @click="clickBtn"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-else>
      <slot name="success" v-if="result == 'success'">발송성공</slot>
      <slot name="error" v-else-if="result == 'error'">발송실패</slot>
      <slot name="default" v-else>발송하기</slot>
    </span>
  </button>
</template>

<script>
export default {
  props: {
    result: {
      type: String,
      default: '',
    },
    sendAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  watch: {
    sendAll(val) {
      if (val) this.loading = true;
    },
    result(val) {
      if (val !== '') this.loading = false;
    },
  },
  methods: {
    clickBtn() {
      this.loading = true;
      this.$emit('click');
    },
  },
};
</script>
<style scoped>
.spinner {
  position: relative;
  top: 2px;
  width: 15px;
  height: 15px;
  display: inline-block;
  border-width: 2px;
  border-color: #5e5e5e;
  border-top-color: #ffffff;
  animation: spin 1s infinite linear;
  border-radius: 100%;
  border-style: solid;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
@media screen and (max-width: 576px) {
  .spinner {
    position: relative;
    top: 3px;
    width: 10px;
    height: 10px;
  }
}
</style>
