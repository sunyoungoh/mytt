<template>
  <v-container class="mt-16">
    <h2 class="text-center">로그인</h2>
    <v-row justify="center" class="mt-8">
      <v-col md="6" sm="12">
        <v-form ref="form" v-model="valid" lazy-validation class="login-form">
          <v-text-field
            ref="brandId"
            placeholder="브랜드 ID를 입력하세요"
            outlined
            :rules="[v => !!v || '브랜드 ID를 꼭 입력해주세요']"
            v-model="brandId"
            hide-details="auto"
            class="mb-4"
            required
            clearable
          >
          </v-text-field>
          <v-text-field
            ref="apiKey"
            placeholder="API KEY를 입력하세요"
            outlined
            :rules="[v => !!v || 'API KEY를 꼭 입력해주세요']"
            v-model="apiKey"
            hide-details="auto"
            class="mb-4"
            required
            clearable
          >
          </v-text-field>
          <p class="text-center error--text text-subtitle-2">{{ errorMsg }}</p>
          <v-btn
            class="font-weight-bold"
            @click="login"
            :loading="loading"
            x-large
            block
            color="primary"
            dark
            elevation="0"
            height="56"
            >로그인하기
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getBrandInfo } from '@/api/items';
import { supabase } from '@/utils/supabase.js';

export default {
  data() {
    return {
      brandId: '',
      apiKey: '',
      valid: true,
      loading: false,
      errorMsg: '',
    };
  },
  methods: {
    async login() {
      // 빈칸 있나 확인
      await this.validate();
      // 빈칸이 없으면 로그인 실행
      if (this.valid == true) {
        this.loading = true;
        try {
          // supabase에 등록된 사용자인지 확인
          let { data } = await supabase
            .from('user')
            .select()
            .eq('brand_id', this.brandId);
          const userInfo = data[0];

          // 등록된 사용자가 맞다면
          if (data.length > 0) {
            const apiKey = this.apiKey.trim();
            let res = await getBrandInfo(apiKey);
            if (res.status == 200 && res.data.brandid == this.brandId) {
              this.$store.dispatch('login', {
                apiKey: apiKey,
                brandId: res.data.brandid,
                brandName: res.data.BrandNameKor,
                digitalAuthor: userInfo.digital_author,
              });
              this.$router.push({ path: '/' });
            }
          } else {
            this.errorMsg = '등록된 회원이 아닙니다.';
          }
        } catch (error) {
          console.log(error);
          if (error.response.data.status == 401) {
            this.errorMsg = '키 생성 후 1시간 안에 반영됩니다!';
          } else {
            this.errorMsg = '로그인을 실패하였습니다.';
          }
        } finally {
          this.loading = false;
        }
      }
    },
    validate() {
      this.$refs.form.validate();
    },
  },
};
</script>

<style>
.login-form {
  max-width: 460px !important;
  margin: 0 auto;
}
</style>
