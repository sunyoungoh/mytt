<template>
  <v-card height="100%" elevation="0">
    <BasicImage :src="item.images?.basicImage" class="basic-img" />
    <v-card-title class="pt-2 pb-5 px-0 card-title d-block">
      {{ itemName }}
      <SalesChip :salesCode="salesCode" class="mt-1" />
    </v-card-title>
  </v-card>
</template>

<script>
import { getItem } from '@/api/items';
import SalesChip from '@/components/common/SalesChip.vue';
import BasicImage from '@/components/image/BasicImage.vue';

export default {
  components: {
    SalesChip,
    BasicImage,
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
    this.fetchItem();
  },
  data() {
    return {
      item: '',
    };
  },
  watch: {
    async itemId() {
      this.fetchItem();
    },
  },
  methods: {
    async fetchItem() {
      let { data } = await getItem(this.itemId);
      this.item = data.outPutValue;
    },
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
