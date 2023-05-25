<template>
  <tr>
    <th
      v-for="(title, i) in titles"
      :key="i"
      :class="[clickField == title.key ? 'filter-tab' : '', title.key]"
      @click="$emit('sort-list', title.key)"
    >
      {{ title.value }}
      <BtnAngle
        v-if="title.key !== 'itemOption'"
        :toggle="
          (orderBy == 'desc' && clickField == title.key) ||
          clickField !== title.key
            ? false
            : true
        "
      />
    </th>
  </tr>
</template>

<script>
import BtnAngle from '@/components/common/BtnAngle.vue';

export default {
  components: {
    BtnAngle,
  },
  props: {
    titles: {
      type: Array,
    },
    orderBy: {
      type: String,
    },
    clickField: {
      type: String,
    },
  },
};
</script>

<style></style>
