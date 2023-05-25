<template>
  <span class="btn-angle">
    <i class="uil uil-angle-down" v-if="!toggle"></i>
    <i class="uil uil-angle-up" v-else></i>
  </span>
</template>

<script>
export default {
  props: {
    toggle: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
