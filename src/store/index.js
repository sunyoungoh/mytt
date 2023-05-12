import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

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
    logout({ commit }) {
      commit('clearApiKey');
      commit('clearBrandId');
      commit('clearBrandName');
    },
  },
  modules: {},
});
