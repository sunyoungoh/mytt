<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto" class="py-4">
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
          <div class="title-text mt-3">
            <span>
              {{ item.name }}
            </span>
            <SalesChip :salesCode="salesCode" class="d-inline" />
          </div>
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
          elevation="0"
          height="48"
          dark
          block
          large
          :loading="loading"
          @click="editItem"
        >
          수정하기
        </v-btn>
        <v-btn
          class="mt-2"
          color="primary"
          height="48"
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
import SalesChip from '@/components/SalesChip.vue';

export default {
  components: {
    ResultDialog,
    SalesChip,
  },
  async mounted() {
    let { data } = await getItem(this.$route.params.id);
    this.item = data.outPutValue;
    this.content = data.outPutValue.content;
    this.salesCode = this.$route.params.salesCode;
  },
  data() {
    return {
      item: '',
      content: '',
      loading: false,
      dialog: false,
      result: '',
      errorMsg: '',
      salesCode: '',
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
.title-text {
  font-size: 1.125rem;
  line-height: 1.3;
  letter-spacing: 0;
  font-weight: 600;
}
[text-narrow] {
  line-height: 1.5 !important;
}
</style>
