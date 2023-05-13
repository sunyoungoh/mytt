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
    <v-card-title class="pt-2 pb-3 px-0 card-title">
      <span class="pr-1">
        {{ itemName }}
      </span>
      <SalesChip :salesCode="salesCode" />
    </v-card-title>
  </v-card>
</template>

<script>
import { getItem } from '@/api/items';
import SalesChip from '@/components/SalesChip.vue';

export default {
  components: {
    SalesChip,
  },
  props: {
    itemId: {
      type: String,
    },
    itemName: {
      type: String,
    },
    salesCode: {
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

<style>
.card-title {
  line-height: 1.3;
  font-size: 0.875rem;
  font-weight: 400;
}
</style>
