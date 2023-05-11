<template>
  <v-card max-width="200" min-height="350px">
    <v-img :src="item.images?.basicImage" height="200px"></v-img>
    <v-card-title class="text-subtitle-1 mb-3">
      {{ itemName }}
    </v-card-title>
  </v-card>
</template>

<script>
import { getItem } from '@/api/items';

export default {
  props: {
    itemId: {
      type: String,
    },
    itemName: {
      type: String,
    },
  },
  async mounted() {
    let { data } = await getItem(this.itemId);
    this.item = data.outPutValue;
  },
  data() {
    return {
      item: '',
    };
  },
};
</script>

<style></style>
