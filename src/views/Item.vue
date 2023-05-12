<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto" class="px-4">
        <div class="title">
          <v-img
            class="title-img"
            :src="item.images?.basicImage"
            width="550"
          ></v-img>
          <div class="title-text text-h6 mt-6">{{ item.name }}</div>
        </div>
        <p class="mt-4 mb-0 text-subtitle-2">상품 상세 설명</p>
        <v-textarea
          v-model="content"
          hide-details
          text-narrow
          class="mt-2 mb-4 text-body-2"
          auto-grow
          filled
          background-color="grey lighten-4"
        ></v-textarea>
        <v-btn
          color="primary"
          dark
          block
          large
          @click="editItem"
          @click.stop="dialog = true"
        >
          수정하기
        </v-btn>
        <ResultDialog
          :dialog="dialog"
          :result="result"
          @close="dialog = false"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ResultDialog from '@/components/ResultDialog.vue';
import { getItem, editItem } from '@/api/items';

export default {
  components: {
    ResultDialog,
  },
  async mounted() {
    let { data } = await getItem(this.$route.params.id);
    this.item = data.outPutValue;
    this.content = data.outPutValue.content;
  },
  data() {
    return {
      item: '',
      content: '',
      loading: false,
      dialog: false,
      result: '',
    };
  },
  methods: {
    async editItem() {
      this.loading = true;
      try {
        let data = await editItem(this.item.itemid, this.content);
        console.log(data);
        this.result = data.status == 200 ? 'success' : 'fail';
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
        this.dialog = true;
      }
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
