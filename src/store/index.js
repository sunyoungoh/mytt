import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { getItems } from '@/api/items';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    apiKey: '',
    brandId: '',
    brandName: '',
  },
  getters: {
    isLogin(state) {
      return state.brandName !== '';
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
    clearApiKey(state) {
      state.apiKey = '';
    },
    clearBrandId(state) {
      state.brandId = '';
    },
    clearBrandName(state) {
      state.brandName = '';
    },
  },
  actions: {
    login({ commit }, payload) {
      commit('setApiKey', payload.apiKey);
      commit('setBrandId', payload.brandId);
      commit('setBrandName', payload.brandName);
    },
    logout({ commit }) {
      commit('clearApiKey');
      commit('clearBrandId');
      commit('clearBrandName');
    },
    async fetchItems() {
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
      return items;
    },
  },
  modules: {},
});
