<template>
  <v-card height="100%" elevation="0">
    <v-img :src="item.images?.basicImage"></v-img>
    <v-card-title class="text-subtitle-2 pb-3">
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
