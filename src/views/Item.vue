<template>
  <div class="item">
    <v-container class="item-container mb-8 px-4 pt-0" v-show="show">
      <PageTitle> 상품 수정 </PageTitle>
      <v-row justify="start">
        <v-col class="d-flex py-0">
          <BasicImage
            :src="item.images?.basicImage"
            class="item-img flex-grow-0 basic-img"
            @click.native="openUrl"
          />
          <div class="item-info mt-md-1 ml-3 flex-grow-1">
            <SalesChip :salesCode="salesCode" />
            <div class="item-title mt-1">
              {{ item.name }}
            </div>
            <div class="price pt-2 pt-md-3 pb-4">
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
        <v-col class="pt-0 pb-16 mb-16">
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
                <div class="mt-3 mr-2 label production-day">예상제작소요일</div>
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
            <!-- 디지털 작가일 경우만 메일 템플릿, 파일 등록 영역 보임 -->
            <div class="file-upload" v-if="$store.getters.isDigitalAuthor">
              <InputLabel>
                <template #title> 메일 템플릿 작성 및 파일 업로드</template>
                <template #desc>
                  디지털 상품 발송을 위해 옵션에 해당하는
                  <span class="font-weight-medium red--text text--lighten-1"
                    >메일 제목과 내용을 입력하시고 .zip 양식의 파일을 업로드
                  </span>
                  해주세요.
                </template>
              </InputLabel>
              <div class="option-wrap pb-1">
                <!-- 옵션 없는 경우 -->
                <template v-if="!itemTypes.length">
                  <div class="no-option-item mt-2 my-4">
                    <div class="mail-template">
                      <v-text-field
                        outlined
                        class="pb-3"
                        v-model="mailTitle[0]"
                        dense
                        placeholder="메일 제목을 입력해주세요"
                        hide-details
                      ></v-text-field>
                      <v-textarea
                        v-model="mailContent[0]"
                        class="pb-3"
                        placeholder="메일 내용을 입력해주세요"
                        outlined
                        auto-grow
                        hide-details
                      />
                    </div>
                    <div class="option-input-wrap">
                      <v-file-input
                        outlined
                        dense
                        class="pt-1"
                        placeholder="업로드할 파일을 선택해주세요."
                        hide-details
                        truncate-length="28"
                        @change="attachFile($event, '0000', 0)"
                        accept="application/zip"
                      ></v-file-input>
                      <div class="d-flex align-center pt-2">
                        <v-btn
                          color="primary"
                          text
                          plain
                          :ripple="false"
                          class="px-0 font-weight-regular"
                          @click="downloadFile('0000')"
                        >
                          기존 파일 다운로드
                        </v-btn>
                        <div class="grey--text text-light-3 mx-2 d-inline">
                          |
                        </div>
                        <v-btn
                          color="primary"
                          text
                          plain
                          :ripple="false"
                          class="px-0 font-weight-regular"
                          @click="deleteFile('0000')"
                        >
                          기존 파일 삭제
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </template>
                <!-- 옵션이 있는 경우 -->
                <div class="option-item" v-else>
                  <div
                    v-for="(option, i) in itemOptions"
                    :key="i"
                    class="pt-4 pb-3 px-4 mt-2 my-4 item"
                  >
                    <div class="label pb-2">
                      <span class="font-weight-medium">옵션{{ i + 1 }}</span>
                      <!-- 옵션명  -->
                      <div class="ml-2 option-detail d-inline">
                        <span v-for="(type, j) in itemTypes" :key="j">
                          {{ type }} : {{ option.optionName[j] }}
                          <span v-if="j < itemTypes.length - 1">/</span>
                        </span>
                      </div>
                    </div>
                    <div class="mail-template">
                      <v-text-field
                        outlined
                        class="pb-3"
                        v-model="mailTitle[i]"
                        dense
                        placeholder="메일 제목을 입력해주세요"
                        hide-details
                      ></v-text-field>
                      <v-textarea
                        v-model="mailContent[i]"
                        class="pb-3"
                        placeholder="메일 내용을 입력해주세요"
                        outlined
                        auto-grow
                        hide-details
                      />
                    </div>
                    <div class="option-input-wrap">
                      <v-file-input
                        outlined
                        dense
                        class="pt-1"
                        truncate-length="28"
                        placeholder="업로드할 파일을 선택해주세요."
                        hide-details
                        @change="attachFile($event, option.itemOption, i)"
                        accept="application/zip"
                      ></v-file-input>
                      <div class="d-flex align-center pt-2">
                        <v-btn
                          color="primary"
                          text
                          plain
                          :ripple="false"
                          class="px-0 font-weight-regular"
                          @click="downloadFile(option.itemOption)"
                        >
                          기존 파일 다운로드
                        </v-btn>
                        <div class="grey--text text-light-3 mx-2 d-inline">
                          |
                        </div>
                        <v-btn
                          color="primary"
                          text
                          plain
                          :ripple="false"
                          class="px-0 font-weight-regular"
                          @click="deleteFile(option.itemOption)"
                        >
                          기존 파일 삭제
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item-content-images" v-if="contentImages?.length">
              <InputLabel>
                <template #title> 상품 설명 이미지 </template>
                <template #desc>
                  텐바이텐에서 등록했던 상품 설명 이미지 파일입니다.
                </template>
              </InputLabel>
              <div class="contemt-images-wrap pb-2">
                <div v-for="(item, i) in contentImages" :key="i">
                  <a :href="item" target="_blank" class="mb-2">
                    <BasicImage
                      :src="item || ''"
                      class="flex-grow-0 content-img mr-2 mb-2"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div class="item-content pb-3">
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
            <div
              class="item-btns px-4 py-2 col-12 justify-center justify-md-end"
            >
              <v-btn
                class="mx-1 flex col-md-2 col-6"
                color="primary"
                height="46"
                large
                outlined
                min-width="180"
                @click="openUrl"
              >
                텐바이텐에 확인하러 가기
              </v-btn>
              <v-btn
                class="mx-1 flex col-md-2 col-6"
                color="primary"
                elevation="0"
                height="46"
                large
                :loading="loading"
                @click="editItem"
              >
                수정하기
              </v-btn>
            </div>
            <ResultDialog
              :dialog="dialog"
              :title="dialogTitle"
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
import {
  uploadFile,
  downloadFile,
  deleteFile,
} from '@/utils/supabaseStorage.js';

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
    this.$nextTick(() => {
      this.fetchItem();
      setTimeout(() => {
        window.scrollTo(0, 0);
        this.show = true;
      }, 200);
    });
  },
  data() {
    return {
      show: false,
      item: [],
      originContent: '',
      // colorCode: '',
      // originContentImages: [],
      content: '',
      contentImages: [],
      loading: false,
      fileArr: [],
      dialog: false,
      dialogTitle: '수정',
      result: '',
      errorMsg: '',
      salesCode: '',
      mailTitle: [],
      mailContent: [],
      salesStatus: '',
      division: '',
      productionDay: '',
      size: '',
      material: '',
      itemTypes: [],
      itemOptions: [],
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
    mailTemplate() {
      const mailTemplateArr = [];
      if (this.item.option?.types?.length) {
        const optionArr = this.item.option.details;
        optionArr.map((item, i) =>
          mailTemplateArr.push({
            optionCode: item.itemOption,
            title: this.mailTitle[i],
            content: this.mailContent[i],
          }),
        );
      } else {
        mailTemplateArr.push({
          optionCode: '0000',
          title: this.mailTitle[0],
          content: this.mailContent[0],
        });
      }
      return mailTemplateArr;
    },
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.fetchItem();
      });
    },
  },
  methods: {
    async attachFile(file, optionCode, index) {
      this.errorMsg = '';
      const zipFile = file;

      if (!zipFile) {
        this.fileArr[index] = {};
      } else {
        this.fileArr[index] = { zipFile, optionCode };
      }
    },

    async downloadFile(optionCode) {
      let { result, publicUrl } = await downloadFile(
        this.item.brandId,
        this.item.itemid,
        optionCode,
      );
      if (result == 'success') {
        window.open(publicUrl, '_blank'); // 파일 다운로드
      } else {
        this.result = 'fail';
        this.dialogTitle = '다운로드';
        this.errorMsg = '등록된 파일이 없습니다.';
        this.dialog = true;
      }
    },

    async deleteFile(optionCode) {
      let result = await deleteFile(
        this.item.brandId,
        this.item.itemid,
        optionCode,
      );
      this.dialogTitle = '파일 삭제';

      // 모달처리
      if (result == 'success') {
        this.result = 'success';
        this.errorMsg = '';
      } else {
        this.result = 'fail';
        this.errorMsg = '';
      }
      this.dialog = true;
    },

    async fetchItem() {
      // ======== 텐바이텐 상품 정보 패치 ========
      const { data } = await getItem(this.$route.params.id);
      const item = data.outPutValue;
      this.item = item;
      this.content = item.content;
      this.originContent = item.content;
      this.salesCode = this.$route.params.salesCode;
      this.salesStatus = this.$route.params.salesCode;
      this.division = item.division;
      this.productionDay = item.productionDay;
      this.material = item.material;
      this.itemTypes = item.option?.types;
      this.itemOptions = !this.itemTypes.length
        ? []
        : this.item.option.details.filter(item => item.Using == 'Y');

      // 상품 상세 이미지 저장
      const imgArr = [];
      data.outPutValue.images.mainImages.map(item => {
        if (item.imageUrl.endsWith('.jpg')) {
          imgArr.push(item.imageUrl);
        }
      });

      // this.originContentImages = [...imgArr];
      this.contentImages = [...imgArr];

      // 사이즈 단위까지 함께 전송되어 숫자만 추출하여 저장 ex) 3*5(cm)
      let originSize = data.outPutValue.size;

      // 사이즈가 비어있지 않다면 사이즈와 단위 분리하여 저장
      if (originSize) {
        // 단위 시작 끝 인덱스
        let unitStartIndex = originSize.indexOf('(');
        let unitEndIndex = originSize.indexOf(')');

        // 사이즈 단위가 있는지 찾는 함수
        const findUnit = () => {
          let result = this.sizeUnit
            .map(item => originSize.indexOf(`(${item.value})`))
            .filter(item => item >= 0);
          return result.length ? true : false;
        };

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

      // ======== 디지털 작가면 메일 템플릿 정보 패치 ========
      if (this.$store.getters.isDigitalAuthor) {
        // 메일 템플릿 초기화
        this.mailTitle = [];
        this.mailContent = [];

        // supabase에서 메일 템플릿 가져오기
        const mailTemplateData = await supabase
          .from('mail')
          .select()
          .eq('item_id', this.item.itemid);
        console.log('메일 템플릿 데이터', mailTemplateData);

        // 템플릿이 있다면 데이터 바인딩
        if (mailTemplateData.data.length) {
          const mailTemplate = mailTemplateData.data[0].template;
          mailTemplate.map(item => {
            this.mailTitle.push(item.title);
            this.mailContent.push(item.content);
          });
        }
      }

      window.scrollTo(0, 0);
    },

    async editItem() {
      this.loading = true;
      this.dialogTitle = '수정';
      this.errorMsg = '';
      this.result = '';

      try {
        // 메일 템플릿 등록
        const templateResult = await supabase.from('mail').upsert(
          {
            brand_id: this.item.brandId,
            item_id: this.item.itemid,
            template: this.mailTemplate,
          },
          { onConflict: 'item_id' },
        );

        console.log('템플릿 등록 결과', templateResult);
        if (templateResult.status !== 201) return (this.result = 'fail');

        // 서버 zip 첨부 파일 등록
        this.fileArr.map(async item => {
          if (item.zipFile) {
            let result = await uploadFile(
              item.zipFile,
              item.optionCode,
              this.item.brandId,
              this.item.itemid,
            );
            if (result !== 'success')
              return (
                (this.result = 'fail'),
                (this.errorMsg = '파일 등록을 실패하였습니다.')
              );
          }
        });

        // 텐바이텐 상세페이지 수정
        let statusResult = '';
        let infoEditResult = '';
        // let imageEditResult = '';

        // 상품 판매상태 수정
        if (this.salesStatus !== this.$route.params.salesCode) {
          let data = await updateItemStatus(this.item.itemid, this.salesStatus);
          statusResult = data.status;
        }

        // 상품 상세 이미지 수정 (api 요청 결과는 성공했다고 돌아오나 아이템 정보를 불러왔을 때는 저장이 안되어있음)
        // console.log(this.item.images.basicImage);
        // if (this.originContentImages !== this.contentImages) {
        //   // 상품코드값이 0으로 에러면 11(흰색)으로 등록
        //   let colorCode = this.colorCode == 0 ? 11 : this.colorCode;
        //   let data = await updateItemImages(this.item.itemid, colorCode, {
        //     imgBasic: this.item.images.basicImage,
        //     imgMain: this.contentImages[0],
        //     imgMain2: this.contentImages[1],
        //     imgMain3: this.contentImages[2],
        //     imgMain4: this.contentImages[3],
        //     imgMain5: this.contentImages[4],
        //   });
        //   imageEditResult = data.status;
        // }

        // 텐바이텐 상품 정보 수정 api 호출
        let { status } = await updateItemInfo({
          itemId: this.item.itemid,
          content: this.content,
          division: this.division,
          productionDay: this.productionDay,
          size: this.size,
          sizeUnit: this.selectedSizeUint.value,
          material: this.material,
        });
        infoEditResult = status;

        // 결과 dialog에 반영할 값 저장
        this.result =
          statusResult == 400 || infoEditResult == 400 ? 'fail' : 'success';
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
    //   deleteImg(index) {
    //     this.contentImages.splice(index, 1);
    //   },
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
.label,
.v-file-input__text,
.v-text-field__slot {
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

footer.v-footer {
  margin-bottom: 70px;
}

@media screen and (min-width: 960px) {
  .v-footer {
    margin-left: 200px;
  }
}
</style>
