<template>
  <v-avatar size="30" class="mr-2">
    <v-img
      class="grey lighten-2"
      :src="item.images?.basicImage"
      aspect-ratio="1"
    >
      <template v-slot:placeholder>
        <LoadingImage />
      </template>
    </v-img>
  </v-avatar>
</template>

<script>
import { getItem } from '@/api/items';
import LoadingImage from '@/components/image/LoadingImage.vue';

export default {
  components: {
    LoadingImage,
  },
  props: {
    itemId: {
      type: String,
    },
  },
  async mounted() {
    this.fetchItem();
  },
  data() {
    return {
      item: [],
    };
  },
  methods: {
    async fetchItem() {
      let { data } = await getItem(this.itemId);
      this.item = data.outPutValue;
    },
  },
};
</script>

<style></style>
