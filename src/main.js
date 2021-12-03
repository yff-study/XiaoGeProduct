// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible'
import { Field,Button,Loading,Overlay} from 'vant';
Vue.use(Loading);
// import Web3 from 'web3'
// Vue.prototype.Web3 = Web3
Vue.use(Field);
Vue.use(Button);
Vue.use(Overlay);
Vue.config.productionTip = false
import VueAxiosPlugin from 'vue-axios-plugin'

Vue.use(VueAxiosPlugin, {
  // 请求拦截处理
  reqHandleFunc: config => config,
  reqErrorFunc: error => Promise.reject(error),
  // 响应拦截处理
  resHandleFunc: response => response.data,
  resErrorFunc: error => Promise.reject(error)
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
