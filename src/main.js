import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.filter('emptyValue', value => {
  return !value ? 'X' : value;
});
Vue.filter('timeFormat', value => {
  const date = new Date(value);
  return date.toLocaleString('ja-JP', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  });
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
