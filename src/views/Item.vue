<template>
  <v-container>
    <v-row class="mt-md-8">
      <v-col cols="auto" class="pt-4 pb-0 item flex-md-grow-0 flex-md-shrink-1">
        <BasicImage :src="item.images?.basicImage" />
      </v-col>
      <v-col class="pt-0 pl-md-1 flex-md-grow-1 flex-md-shrink-0">
        <div class="title-text mt-3 mt-md-4">
          <span>
            {{ item.name }}
          </span>
          <SalesChip :salesCode="salesCode" class="d-inline" />
        </div>
        <InputLabel>
          <template #title> 상품 상세 설명 </template>
          <template #desc> HTML태그와 TEXT를 입력할 수 있습니다. </template>
        </InputLabel>
        <v-textarea
          v-model="content"
          flat
          hide-details
          text-narrow
          class="mt-2 mb-3 text-body-2"
          auto-grow
          outlined
        ></v-textarea>
        <div class="btns mb-6">
          <v-btn
            color="primary"
            elevation="0"
            height="48"
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
            block
            large
            outlined
            @click="openUrl"
          >
            텐바이텐에 확인하러 가기
          </v-btn>
        </div>
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
import { getItem, editItem } from '@/api/items';
import ResultDialog from '@/components/ResultDialog.vue';
import BasicImage from '@/components/BasicImage.vue';
import SalesChip from '@/components/SalesChip.vue';
import InputLabel from '@/components/InputLabel.vue';

export default {
  components: {
    ResultDialog,
    SalesChip,
    InputLabel,
    BasicImage,
  },
  async mounted() {
    let { data } = await getItem(this.$route.params.id);
    this.item = data.outPutValue;
    this.content = data.outPutValue.content;
    this.salesCode = this.$route.params.salesCode;
  },
  data() {
    return {
      item: [],
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

<style scope>
.title-text {
  font-size: 1.25rem;
  line-height: 1.3;
  letter-spacing: 0;
  font-weight: 600;
}
[text-narrow] {
  line-height: 1.5 !important;
}

.theme--light.v-text-field--outlined:not(.v-input--is-focused):not(
    .v-input--has-state
  )
  > .v-input__control
  > .v-input__slot
  fieldset {
  color: #d9d9d9;
}
.v-textarea.v-text-field--enclosed.v-text-field--outlined:not(.v-input--dense)
  textarea {
  margin-bottom: 10px;
}
</style>
