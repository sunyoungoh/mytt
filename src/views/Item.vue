<template>
  <div item>
    <ItemNav />
    <v-container class="item mb-8 px-4">
      <PageTitle> 상품 수정 </PageTitle>
      <v-row justify="start">
        <v-col class="d-flex pt-0">
          <BasicImage
            :src="item.images?.basicImage"
            class="item-img flex-grow-0"
            @click.native="openUrl"
          />
          <div class="item-info mt-md-1 ml-3 flex-grow-1">
            <SalesChip :salesCode="salesCode" />
            <div class="item-title mt-1">
              {{ item.name }}
            </div>
            <div class="price pt-2 pt-md-3">
              <template v-if="item.orgprice !== item.sellPrice">
                <div class="price-origin grey--text grey-darken-3">
                  {{ item.orgprice | comma }}원
                </div>
                <span class="red--text"> {{ salePer }}% </span>
              </template>
              <span class="d-inline font-weight-bold">
                {{ item.sellPrice | comma }}원
              </span>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <div class="edit-wrap">
            <InputLabel>
              <template #title> 판매 상태 </template>
            </InputLabel>
            <v-radio-group
              v-model="salesStatus"
              row
              class="mt-0 pb-3"
              :ripple="false"
              hide-details
            >
              <v-radio label="판매중" value="Y"></v-radio>
              <v-radio label="판매중지" value="N"></v-radio>
              <v-radio label="일시품절" value="S"></v-radio>
            </v-radio-group>
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
              rows="7"
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
              @close="closeDialog"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { getItem, editItem, updateItemStatus } from '@/api/items';
import PageTitle from '@/components/common/PageTitle.vue';
import ItemNav from '@/components/item/ItemNav.vue';
import ResultDialog from '@/components/common/ResultDialog.vue';
import BasicImage from '@/components/image/BasicImage.vue';
import SalesChip from '@/components/common/SalesChip.vue';
import InputLabel from '@/components/common/InputLabel.vue';

export default {
  components: {
    ItemNav,
    PageTitle,
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
      salesStatus: '',
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
      this.salesStatus = this.$route.params.salesCode;
    },
    async editItem() {
      this.loading = true;
      try {
        let statusResult = await updateItemStatus(
          this.item.itemid,
          this.salesStatus,
        );
        let editResult = await editItem(this.item.itemid, this.content);
        this.result =
          statusResult.status == 200 && editResult.status == 200
            ? 'success'
            : 'fail';
      } catch ({ response }) {
        this.errorMsg = response.data.message;
      } finally {
        this.loading = false;
        this.dialog = true;
      }
    },
    closeDialog() {
      this.dialog = false;
      if (this.salesStatus !== this.$route.params.salesCode) {
        this.$router.push({
          path: `/item/${this.item.itemid}/${this.salesStatus}`,
        });
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
[text-narrow] {
  line-height: 1.5 !important;
}
.v-label {
  font-size: 14px !important;
}
.v-application--is-ltr .v-input--selection-controls__input {
  margin-right: 4px;
}
.v-input--selection-controls__ripple {
  display: none !important;
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
