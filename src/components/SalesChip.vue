<template>
  <div class="chip">
    <v-chip
      v-if="salesCode == 'Y'"
      x-small
      label
      class="px-1 font-weight-medium"
      color="success"
    >
      판매중
    </v-chip>
    <v-chip
      v-if="salesCode == 'S'"
      x-small
      label
      class="px-1 font-weight-medium"
      color="warning"
    >
      일시품절
    </v-chip>
    <v-chip
      v-if="salesCode == 'N'"
      x-small
      label
      class="px-1 font-weight-medium"
      color="error"
    >
      품절
    </v-chip>
  </div>
</template>

<script>
export default {
  props: {
    salesCode: {
      type: String,
      default: '',
    },
  },
};
</script>

<style>
.chip {
  display: inline-block;
  position: relative;
  bottom: 1px;
}
</style>
