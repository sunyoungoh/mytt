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
            <div class="item-status">
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
            </div>
            <div class="item-division">
              <InputLabel>
                <template #title> 판매 구분 </template>
              </InputLabel>
              <v-radio-group
                v-model="division"
                row
                class="mt-0 pb-3"
                :ripple="false"
                hide-details
              >
                <v-radio label="일반상품" value="N"></v-radio>
                <v-radio label="주문제작상품" value="C"></v-radio>
                <v-radio label="문구필요 주문제작상품" value="M"></v-radio>
              </v-radio-group>
              <div class="d-flex" v-if="division == 'M'">
                <div class="mt-3 mr-2 text-body-2 label production-day">
                  예상제작소요일
                </div>
                <v-text-field
                  outlined
                  class="text-body-2 pb-3"
                  v-model="productionDay"
                  dense
                  hide-details
                  suffix="일"
                ></v-text-field>
              </div>
            </div>
            <div class="item-content">
              <InputLabel>
                <template #title> 상품 상세 설명 </template>
                <template #desc>
                  HTML태그와 TEXT를 입력할 수 있습니다.
                </template>
              </InputLabel>
              <v-textarea
                v-model="content"
                flat
                hide-details
                text-narrow
                class="mt-2 pb-3 text-body-2"
                auto-grow
                outlined
              ></v-textarea>
            </div>
            <div class="item-material">
              <InputLabel>
                <template #title> 상품 재질 </template>
                <template #desc> </template>
              </InputLabel>
              <div class="pb-3 d-flex">
                <v-text-field
                  outlined
                  class="text-body-2 col-8"
                  v-model="material"
                  dense
                  hide-details
                ></v-text-field>
              </div>
            </div>
            <div class="item-size">
              <InputLabel>
                <template #title> 상품사이즈 </template>
                <template #desc> </template>
              </InputLabel>
              <div class="pb-3 d-flex">
                <v-text-field
                  outlined
                  class="text-body-2 col-8"
                  v-model="size"
                  dense
                  hide-details
                ></v-text-field>
                <v-select
                  v-model="selectedSizeUint"
                  :items="sizeUnit"
                  item-text="text"
                  item-value="value"
                  return-object
                  hide-details
                  outlined
                  dense
                  class="text-body-2 ml-2 selectbox-size"
                ></v-select>
              </div>
            </div>
            <div class="btns mb-6 pt-3">
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
import { getItem, updateItemInfo, updateItemStatus } from '@/api/items';
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
      originContent: '',
      content: '',
      loading: false,
      dialog: false,
      result: '',
      errorMsg: '',
      salesCode: '',
      salesStatus: '',
      division: '',
      productionDay: '',
      size: '',
      material: '',
      selectedSizeUint: { text: 'mm', value: 'mm' },
      sizeUnit: [
        { text: '직접입력', value: '' },
        { text: 'mm', value: 'mm' },
        { text: 'cm', value: 'cm' },
        { text: 'm', value: 'm' },
        { text: 'km', value: 'km' },
        { text: 'm²', value: 'm²' },
        { text: 'km²', value: 'km²' },
        { text: 'ha', value: 'ha' },
        { text: 'm³', value: 'm³' },
        { text: 'cm³', value: 'cm³' },
        { text: 'L', value: 'L' },
        { text: 'g', value: 'g' },
        { text: 'Kg', value: 'Kg' },
      ],
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
      this.originContent = data.outPutValue.content;
      this.salesCode = this.$route.params.salesCode;
      this.salesStatus = this.$route.params.salesCode;
      this.division = data.outPutValue.division;
      this.productionDay = data.outPutValue.productionDay;
      this.material = data.outPutValue.material;

      // 사이즈 단위까지 함께 전송되어 숫자만 추출하여 저장 ex) 3*5(cm)
      let originSize = data.outPutValue.size;
      console.log(originSize);
      // 사이즈가 비어있지 않다면 사이즈와 단위 분리하여 저장
      if (originSize && originSize.indexOf('(') > 0) {
        let index = originSize.indexOf('(');
        if (index > 0) {
          // 사이즈 숫자 저장
          this.size = originSize.slice(0, index);
          // () 괄호 제거 후 사이즈 단위만 저장
          let originSizeUnit = originSize.slice(index + 1, -1);
          this.selectedSizeUint = this.sizeUnit.filter(
            item => item.value == originSizeUnit,
          )[0];
        }
      } else if (originSize) {
        this.size = originSize;
        this.selectedSizeUint = { text: '직접입력', value: '' };
      } else {
        this.size = '';
        this.selectedSizeUint = { text: 'mm', value: 'mm' };
      }
    },
    async editItem() {
      this.loading = true;
      this.result = '';
      try {
        let statusResult = '';
        let editResult = '';

        if (this.salesStatus !== this.$route.params.salesCode) {
          let data = await updateItemStatus(this.item.itemid, this.salesStatus);
          statusResult = data.status;
        }

        // 수정 api 호출
        let { status } = await updateItemInfo({
          itemId: this.item.itemid,
          content: this.content,
          division: this.division,
          productionDay: this.productionDay,
          size: this.size,
          sizeUnit: this.selectedSizeUint.value,
          material: this.material,
        });
        editResult = status;

        // 결과 dialog에 반영할 값 저장F
        this.result =
          (statusResult == 200 && editResult == 200) ||
          (statusResult == 200 && editResult == '') ||
          (statusResult == '' && editResult == 200)
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
      this.fetchItem();
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
.v-label,
.label {
  font-size: 14px !important;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif' !important;
}
.label.production-day {
  position: relative;
  top: -2px;
  word-break: keep-all;
  word-wrap: normal;
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
.selectbox-size .v-select__slot {
  width: 110px !important;
}
.v-input--radio-group.v-input--radio-group--row .v-radio {
  margin-right: 10px;
}

.v-radio .v-icon {
  font-size: 20px;
}
.v-radio .v-input--selection-controls__input {
  margin-right: 0px;
}
</style>
