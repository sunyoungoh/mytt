<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto" class="px-4">
        <div class="title">
          <v-img
            class="title-img grey lighten-2"
            :src="item.images?.basicImage"
            @click="openUrl"
            aspect-ratio="1"
            width="550"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row> </template
          ></v-img>
          <div class="title-text text-h6 mt-3">{{ item.name }}</div>
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
          :loading="loading"
          @click="editItem"
        >
          수정하기
        </v-btn>
        <v-btn
          class="mt-4 mb-8"
          color="primary"
          dark
          block
          large
          outlined
          @click="openUrl"
        >
          텐바이텐에 확인하러 가기
        </v-btn>
        <ResultDialog
          :dialog="dialog"
          :result="result"
          :errorMsg="errorMsg"
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
      errorMsg: '',
    };
  },
  methods: {
    async editItem() {
      this.loading = true;
      try {
        let data = await editItem(this.item.itemid, this.content);
        this.result = data.status == 200 ? 'success' : 'fail';
      } catch ({ response }) {
        this.errorMsg = response.data.message;
      } finally {
        this.loading = false;
        this.dialog = true;
      }
    },
    openUrl() {
      let url = `
      http://www.10x10.co.kr/shopping/category_prd.asp?itemid=${this.item.itemid}&disp=${this.item.categories[0].catecode}&pBtr=${this.item.brandId}
      `;
      window.open(url, '_blank', 'noreferrer');
    },
  },
};
</script>

//
<style scope>
.title-img {
  cursor: pointer;
}
[text-narrow] {
  line-height: 1.5 !important;
}
</style>
