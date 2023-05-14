<template>
  <div>
    <ItemNav />
    <v-container class="mb-8 item pa-4">
      <v-row class="pt-md-8" justify="start">
        <v-col class="d-flex">
          <BasicImage
            :src="item.images?.basicImage"
            class="item-img flex-grow-0"
          />
          <div class="item-info mt-1 ml-3 flex-grow-1">
            <SalesChip :salesCode="salesCode" />
            <div class="title-text mt-1">
              {{ item.name }}
            </div>
            <div class="price pt-1 pt-sm-2 pt-md-3">
              <template v-if="item.orgprice !== item.sellPrice">
                <div
                  class="text-body-2 text-decoration-line-through grey--text grey-darken-3"
                >
                  {{ item.orgprice | comma }}원
                </div>
                <div>
                  <span class="red--text font-weight-bold">
                    {{ salePer }}%
                  </span>
                  <span class="font-weight-bold">
                    {{ item.sellPrice | comma }}원
                  </span>
                </div>
              </template>
              <template v-else>
                <span class="font-weight-bold">
                  {{ item.sellPrice | comma }}원
                </span>
              </template>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0">
          <div class="edit-wrap">
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
              rows="8"
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
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { getItem, editItem } from '@/api/items';
import ItemNav from '@/components/item/ItemNav.vue';
import ResultDialog from '@/components/common/ResultDialog.vue';
import BasicImage from '@/components/image/BasicImage.vue';
import SalesChip from '@/components/common/SalesChip.vue';
import InputLabel from '@/components/common/InputLabel.vue';

export default {
  components: {
    ItemNav,
    ResultDialog,
    SalesChip,
    InputLabel,
    BasicImage,
  },
  mounted() {
    this.fetchItem();
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
  computed: {
    salePer() {
      return Math.ceil(
        ((this.item.orgprice - this.item.sellPrice) / this.item.orgprice) * 100,
      );
    },
  },
  watch: {
    $route() {
      this.fetchItem();
    },
  },
  methods: {
    async fetchItem() {
      let { data } = await getItem(this.$route.params.id);
      this.item = data.outPutValue;
      this.content = data.outPutValue.content;
      this.salesCode = this.$route.params.salesCode;
    },
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
  filters: {
    comma(val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
};
</script>

<style scope>
.title-text {
  font-size: 17px;
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

/* @media screen and (max-width: 425px) {
  .price {
    display: inline-flex;
    flex-flow: row-reverse;
    align-items: baseline;
    gap: 0.25rem;
  } */
/* } */

@media screen and (min-width: 600px) {
  .title-text {
    font-size: 1.25rem;
  }
}

@media screen and (min-width: 960px) {
  .item {
    margin-left: 230px;
    width: calc(100% - 260px);
  }
  .title-text {
    font-size: 1.375rem;
  }
}
</style>
