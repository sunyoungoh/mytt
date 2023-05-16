<template>
  <div>
    <v-container class="item-container mb-8 px-4">
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
      <v-row class="mb-6">
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
                  텍스트 편집기에 내용 입력 및 이미지를 넣어보세요.
                </template>
              </InputLabel>
              <HtmlEditor v-model="content" />
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
            <div class="item-btns px-2 py-2 d-flex justify-end">
              <v-btn
                class="mx-1"
                color="primary"
                height="46"
                width="180"
                large
                outlined
                @click="openUrl"
              >
                텐바이텐에 확인하러 가기
              </v-btn>
              <v-btn
                class="mx-1 flex"
                color="primary"
                elevation="0"
                height="46"
                max-width="180"
                large
                :loading="loading"
                @click="editItem"
              >
                수정하기
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
import ResultDialog from '@/components/common/ResultDialog.vue';
import BasicImage from '@/components/image/BasicImage.vue';
import SalesChip from '@/components/common/SalesChip.vue';
import InputLabel from '@/components/common/InputLabel.vue';
import HtmlEditor from '@/components/HtmlEditor.vue';

import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/utils/supabase.js';

export default {
  components: {
    PageTitle,
    ResultDialog,
    SalesChip,
    InputLabel,
    BasicImage,
    HtmlEditor,
  },
  mounted() {
    this.fetchItem();
  },
  data() {
    return {
      item: [],
      originContent: '',
      content: '',
      image: undefined,
      imageUrl: '',
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
      selectedSizeUint: { text: '직접입력', value: '' },
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

      // 단위 시작 끝 인덱스
      let unitStartIndex = originSize.indexOf('(');
      let unitEndIndex = originSize.indexOf(')');

      // 사이즈 단위가 있는지 찾는 함수
      const findUnit = () => {
        let result = this.sizeUnit
          .map(item => originSize.indexOf(`(${item.value})`))
          .filter(item => item >= 0);
        return result.length > 0 ? true : false;
      };

      // 사이즈가 비어있지 않다면 사이즈와 단위 분리하여 저장
      if (originSize) {
        // 사이즈 단위 있나 체크
        let existUnit = findUnit();

        if (existUnit) {
          // 단위가 끝에 (cm) 형태로 있으면 잘라서 저장
          if (unitStartIndex > 0 && unitEndIndex + 1 == originSize.length) {
            // 사이즈 숫자 저장
            this.size = originSize.slice(0, unitStartIndex);
            // () 괄호 제거 후 사이즈 단위만 저장
            let originSizeUnit = originSize.slice(unitStartIndex + 1, -1);
            this.selectedSizeUint = this.sizeUnit.filter(
              item => item.value == originSizeUnit,
            )[0];
          }
        } else {
          this.size = originSize;
          this.selectedSizeUint = { text: '직접입력', value: '' };
        }
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
    async createImageUrl(file) {
      console.log(file);
      try {
        const blob = file;

        if (!blob) {
          return;
        }
        const key = uuidv4();
        const bucket = 'images'; // supabase 에 미리 만들어둔 public 버킷 이름

        await supabase.storage.from(bucket).upload(key, blob, {
          cacheControl: '3600',
        });

        const { publicUrl } = await supabase.storage
          .from(bucket)
          .getPublicUrl(key).data;
        console.log(publicUrl);
        this.imageUrl = publicUrl;
      } catch (err) {
        console.log(err);
      }
    },
    onFileChange(file) {
      if (!file) {
        return;
      }
      this.createImageUrl(file);
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

.v-footer {
  margin-bottom: 70px;
}

@media screen and (min-width: 960px) {
  .v-footer {
    margin-left: 200px;
  }
}
</style>
