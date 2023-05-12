<template>
  <v-card height="100%" elevation="0">
    <v-img
      :src="item.images?.basicImage"
      aspect-ratio="1"
      class="grey lighten-2"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <v-card-title class="text-subtitle-2 pt-2 pb-3 px-0">
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
