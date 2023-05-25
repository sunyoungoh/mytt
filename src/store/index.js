import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { getItems } from '@/api/items';
import { getNaverAuth, updateNaverAuth } from '@/utils/supabaseDatabase.js';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    apiKey: '',
    brandId: '',
    brandName: '',
    digitalAuthor: false,
    items: [],
    mailUser: '',
    mailPassword: '',
  },
  getters: {
    isLogin(state) {
      return state.brandName !== '';
    },
    isDigitalAuthor(state) {
      return state.digitalAuthor;
    },
  },
  mutations: {
    setApiKey(state, apiKey) {
      state.apiKey = apiKey;
    },
    setBrandId(state, brandId) {
      state.brandId = brandId;
    },
    setBrandName(state, brandName) {
      state.brandName = brandName;
    },
    setItems(state, items) {
      state.items = items;
    },
    setMailUser(state, mailUser) {
      state.mailUser = mailUser;
    },
    setMailPassword(state, mailPassword) {
      state.mailPassword = mailPassword;
    },
    setDigitalAuthor(state, digitalAuthor) {
      state.digitalAuthor = digitalAuthor;
    },
    clearMailUser(state) {
      state.mailUser = '';
    },
    clearMailPassword(state) {
      state.mailPassword = '';
    },
    clearApiKey(state) {
      state.apiKey = '';
    },
    clearBrandId(state) {
      state.brandId = '';
    },
    clearBrandName(state) {
      state.brandName = '';
    },
    clearItems(state) {
      state.items = '';
    },
    clearDigitalAuthor(state) {
      state.digitalAuthor = false;
    },
  },
  actions: {
    login({ commit }, payload) {
      commit('setApiKey', payload.apiKey);
      commit('setBrandId', payload.brandId);
      commit('setBrandName', payload.brandName);
      commit('setDigitalAuthor', payload.digitalAuthor);
    },
    logout({ commit }) {
      commit('clearApiKey');
      commit('clearBrandId');
      commit('clearBrandName');
      commit('clearMailUser');
      commit('clearMailPassword');
      commit('clearDigitalAuthor');
      commit('clearItems');
    },
    async fetchItems({ commit }) {
      // 한 페이지당 100개씩 가져오기 때문에 페이지수로 호출
      let count = 1;
      let { data } = await getItems(count);
      let items = data;

      //100개가 넘으면 다음페이지 호출
      while (items.length % 100 == 0) {
        count++;
        let { data } = await getItems(count);
        items.push(...data);
      }
      commit('setItems', items);
    },
    async fetchNaverAuth({ state, commit }) {
      const naverAuth = await getNaverAuth(state.brandId);

      if (naverAuth) {
        commit('setMailUser', naverAuth.userEmail);
        commit('setMailPassword', naverAuth.userPass);
      }
    },
    async updateNaverAuth({ state, commit }, payload) {
      const updateResult = await updateNaverAuth(
        payload.email,
        payload.password,
        state.brandId,
      );
      if (updateResult) {
        commit('setMailUser', updateResult.naver_email);
        commit('setMailPassword', updateResult.naver_password);
        return 'success';
      } else {
        return 'fail';
      }
    },
  },
  modules: {},
});
