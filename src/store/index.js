import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiKey: process.env.VUE_APP_API_KEY,
    brandId: '',
  },
  mutations: {
    setBrandId(state, brandId) {
      state.brandId = brandId;
    },
  },
  actions: {},
  modules: {},
});
