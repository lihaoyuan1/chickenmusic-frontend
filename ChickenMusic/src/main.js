// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import Mui from 'vue-awesome-mui'

import 'common/css/index.css'

Vue.config.productionTip = false
FastClick.attach(document.body)
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})
Vue.use(Mui)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
