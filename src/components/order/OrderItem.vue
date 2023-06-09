<template>
  <tr>
    <td
      v-for="(title, i) in titles"
      :key="i"
      :data-title="title.value"
      :class="[
        clickField == title.key ? 'filter-tab' : '',
        title.key == 'itemRequireMemo' || title.key == 'requireMemo'
          ? 'memo'
          : '',
      ]"
    >
      <span
        v-if="title.key == 'orderDate' || title.key == 'createdAt'"
        class="date"
      >
        {{ item[title.key] | timeFormat }}
      </span>
      <!-- 사용자 아이디 암호화 -->
      <!-- <span v-else-if="title.key == 'ordererId'">
        {{ secretUserId | emptyValue }}
      </span> -->
      <router-link
        v-else-if="title.key == 'itemName'"
        :to="`/item/${item.itemId}/${salesCode}`"
      >
        {{ item[title.key] | emptyValue }}
      </router-link>
      <v-btn
        v-else-if="title.key == 'file'"
        small
        outlined
        color="primary"
        class="py-1 py-sm-3"
        @click="clickDownloadBtn(item.itemOptionCode)"
      >
        다운로드
      </v-btn>
      <template v-else-if="title.key == 'sendMail'">
        <v-btn
          v-if="sendResult == '' && postResult == ''"
          small
          sm-x-small
          color="primary"
          class="py-1 py-sm-3"
          :loading="sendLoading"
          elevation="0"
          :disabled="!$store.state.mailUser || !$store.state.mailPassword"
          @click="sendMail(item.itemOptionCode)"
        >
          메일 발송
        </v-btn>
        <v-btn
          v-else-if="sendResult == 'success' && postResult == 'success'"
          small
          sm-x-small
          color="success"
          class="py-1 py-sm-3"
          elevation="0"
        >
          발송 성공
        </v-btn>
        <v-btn
          v-else-if="sendResult == 'fail' && postResult == ''"
          small
          sm-x-small
          color="error darken-1"
          class="py-1 py-sm-3"
          elevation="0"
        >
          발송 실패
        </v-btn>
        <v-btn
          v-else-if="postResult == 'fail'"
          small
          sm-x-small
          color="error darken-1"
          class="py-1 py-sm-3"
          elevation="0"
        >
          송장 등록 실패
        </v-btn>
      </template>
      <span v-else>
        {{ item[title.key] | emptyValue }}
      </span>
    </td>
    <ResultDialog
      :dialog="dialog"
      :title="dialogTitle"
      :result="result"
      :errorMsg="errorMsg"
      @close="dialog = false"
    />
  </tr>
</template>

<script>
import { sendMail, dispatchOrder } from '@/api/orders';
import { secretId } from '@/utils/filters';
import { downloadFile } from '@/utils/supabaseStorage.js';
import ResultDialog from '@/components/common/ResultDialog.vue';
import { supabase } from '@/utils/supabase.js';

export default {
  components: {
    ResultDialog,
    // TableBtn,
  },
  props: {
    titles: {
      type: Array,
    },
    item: {
      type: Object,
    },
    clickField: {
      type: String,
    },
    sendAll: {
      type: Boolean,
    },
  },
  data() {
    return {
      sendResult: '',
      postResult: '',
      dialog: false,
      dialogTitle: '다운로드',
      result: '',
      errorMsg: '',
      salesCode: '',
      sendLoading: false,
    };
  },
  async mounted() {
    await this.$store.dispatch('fetchItems');
    this.salesCode = this.$store.state.items.filter(
      item => item.itemId == this.item.itemId,
    )[0].salesCode;
  },
  watch: {
    sendAll(val) {
      if (val == true) {
        this.sendMailAndPostOrder();
      }
    },
  },
  computed: {
    secretUserId() {
      const ordererId = this.item.ordererId;
      return secretId(ordererId);
    },
    validateEmail() {
      const reg = /.+@.+\..+/;
      return reg.test(this.item.itemRequireMemo);
    },
    toEmail() {
      const reg = /\S+@+\S+\.+[a-zA-Z]{2,3}/;
      let email = this.validateEmail
        ? this.item.itemRequireMemo.match(reg)[0]
        : this.item.ordererEmail;

      return email;
    },
    dispatchData() {
      return {
        orderSerial: this.item.orderSerial,
        detailIdx: this.item.detailIdx,
      };
    },
  },
  methods: {
    async sendMail(optionCode) {
      this.sendLoading = true;

      // 파일 받아오기
      const { result, fileName, publicUrl } = await downloadFile(
        this.$store.state.brandId,
        this.item.itemId,
        optionCode,
      );

      // 메일 템플릿 변수 선언
      let mailTitle = '';
      let mailContent = '';

      // supabase에서 메일 템플릿 가져오기
      const { data } = await supabase
        .from('mail')
        .select()
        .eq('item_id', this.item.itemId);

      // 해당 상품 템플릿 정보가 있다면 옵션값에 맞는 템플릿 가져오기
      if (data.length) {
        const { template } = data[0];
        const { title, content } = template
          .filter(item => item.optionCode == optionCode)
          .shift();
        mailTitle = title;
        mailContent = content;
      }

      // 메일 전송하고 송장등록하기
      try {
        this.sendResult = '';
        this.postResult = '';
        const { status } = await sendMail({
          brandName: this.$store.state.brandName,
          userEmail: this.$store.state.mailUser,
          password: this.$store.state.mailPassword,
          toEmail: this.toEmail,
          title: mailTitle,
          content: mailContent.replaceAll('\n', '<br/>'),
          fileName: result == 'success' ? fileName : '',
          publicUrl: result == 'success' ? publicUrl : '',
        });
        if (status == 200) {
          this.postOrder();
        }
      } catch (error) {
        if (error.response.status == 400) {
          this.dialogTitle = '로그인';
          this.result = 'fail';
          this.errorMsg = '아이디와 비밀번호를 확인해주세요.';
          this.dialog = true;
        }
        this.sendResult = 'fail';
        this.sendLoading = false;
      }
    },
    async postOrder() {
      const { data } = await dispatchOrder(this.dispatchData);
      console.log(data);
      if (data.code == 'SUCCESS') {
        this.sendResult = 'success';
        this.postResult = 'success';
      } else {
        this.postResult = 'fail';
      }
      this.sendLoading = false;
    },
    async clickDownloadBtn(optionCode) {
      const { result, publicUrl } = await downloadFile(
        this.$store.state.brandId,
        this.item.itemId,
        optionCode,
      );
      if (result == 'success') {
        window.open(publicUrl, '_blank'); // 파일 다운로드
      } else {
        this.dialogTitle = '다운로드';
        this.result = 'fail';
        this.errorMsg = '등록된 파일이 없습니다.';
        this.dialog = true;
      }
    },
  },
};
</script>
<style scoped>
a {
  color: #000;
}
</style>
