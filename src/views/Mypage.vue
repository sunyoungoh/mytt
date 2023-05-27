<template>
  <div class="mypage">
    <v-container class="mb-8 order px-4">
      <PageTitle> 마이페이지 </PageTitle>
      <div class="brand-info d-flex">
        <h3>{{ $store.state.brandName }}</h3>
        <span class="ml-1 text-body-2">{{ $store.state.brandId }}</span>
      </div>
      <div class="mail-input-wrap" v-if="$store.getters.isDigitalAuthor">
        <InputLabel>
          <template #title> 네이버 메일 등록</template>
          <template #desc>
            디지털 상품을 발송할 때 사용되는 이메일 주소입니다.
          </template>
        </InputLabel>

        <v-form ref="form" v-model="valid" lazy-validation>
          <div class="email-input pb-3">
            <v-text-field
              outlined
              ref="naverEmail"
              placeholder="네이버 이메일을 입력하세요"
              :rules="emailRules"
              v-model="naverEmail"
              hide-details="auto"
              class="mb-2"
              @blur="onBlur"
            >
            </v-text-field>
            <v-text-field
              outlined
              ref="naverPassword"
              type="password"
              placeholder="네이버 비밀번호를 입력하세요"
              v-model="naverPassword"
              hide-details="auto"
              class="mb-2"
              @blur="onBlur"
            >
            </v-text-field>
            <v-btn
              elevation="0"
              color="primary"
              class="btn-save"
              height="56"
              block
              :disabled="!valid"
              @click="saveNaverAuth"
              >저장하기
            </v-btn>
            <v-btn
              small
              text
              color="red"
              class="px-2 mt-2"
              href="https://www.craft.do/s/O3QCKFdW2Ip10m"
              target="_blank"
              >메일 발송 기능 관련 안내 보러 가기 >
            </v-btn>
          </div>
        </v-form>
      </div>
      <div class="bottom-wrap">
        <v-btn
          v-if="$store.getters.isLogin"
          plain
          class="text-decoration-underline"
          :ripple="false"
          @click="logout"
        >
          로그아웃
        </v-btn>
      </div>
    </v-container>
    <ResultDialog
      :dialog="dialog"
      :title="dialogTitle"
      :result="result"
      @close="closeDialog"
    />
  </div>
</template>

<script>
import PageTitle from '@/components/common/PageTitle.vue';
import InputLabel from '@/components/common/InputLabel.vue';
import ResultDialog from '@/components/common/ResultDialog.vue';
import { getDecodeKey } from '@/utils/crypto.js';

export default {
  components: {
    PageTitle,
    InputLabel,
    ResultDialog,
  },
  async mounted() {
    await this.$store.dispatch('fetchNaverAuth');
    this.naverEmail = this.$store.state.mailUser;
    this.naverPassword = getDecodeKey(this.$store.state.mailPassword);
  },
  data() {
    return {
      valid: true,
      dialog: false,
      dialogTitle: '등록',
      result: '',
      naverEmail: '',
      naverPassword: '',
      emailRules: [v => /.+@.+\..+/.test(v) || '이메일 양식이 아닙니다.'],
    };
  },
  computed: {
    originPassword() {
      return getDecodeKey(this.$store.state.mailPassword);
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({ path: '/login' });
    },
    async saveNaverAuth() {
      // 비밀번호 수정 여부 확인 후 새 비밀번호에 저장
      const newPassword =
        this.naverPassword !== this.originPassword
          ? this.naverPassword
          : this.originPassword;
      const updateResult = await this.$store.dispatch('updateNaverAuth', {
        email: this.naverEmail,
        password: newPassword,
      });
      this.result = updateResult;
      this.dialog = true;
    },
    onBlur() {
      if (this.naverEmail == '') {
        this.$refs.form.resetValidation();
      }
    },
    closeDialog() {
      this.dialog = false;
    },
  },
};
</script>

<style>
.mypage {
  max-width: 600px !important;
  margin: 0 auto;
}
.v-label,
.label,
.v-file-input__text,
.v-text-field__slot {
  font-size: 14px !important;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif' !important;
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
.btn-save {
  font-size: 15px !important;
}
</style>
