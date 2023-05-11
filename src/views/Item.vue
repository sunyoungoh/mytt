<template>
  <v-container>
    <div>
      <v-img height="250" width="250" :src="item.images?.basicImage"></v-img>
      <h2 class="mt-4">{{ item.name }}</h2>
    </div>
    <!-- <v-text-field readonly :value="item.contentType"></v-text-field> -->
    <v-textarea
      text-narrow
      class="mt-4 text-body-2"
      label="상품 상세 설명"
      auto-grow
      filled
      background-color="grey lighten-4"
      v-model="content"
    ></v-textarea>
    <v-btn @click="editItem">수장힉;</v-btn>
  </v-container>
</template>

<script>
import { getItem, editItem } from '@/api/items';

export default {
  async mounted() {
    let { data } = await getItem(this.$route.params.id);
    this.item = data.outPutValue;
    this.content = data.outPutValue.content;
    console.log(this.content.match(/https/gi));
  },
  data() {
    return {
      item: '',
      content: '',
    };
  },
  methods: {
    async editItem() {
      console.log(this.item.itemid);
      let data = await editItem(this.item.itemid, this.content);
      console.log(data);
    },
  },
};
</script>

//
<style scope>
[text-narrow] {
  line-height: 1.5 !important;
}
</style>
