// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

// import './static/UE/ueditor.config.js'
// import './static/UE/ueditor.all.min.js'
// import './static/UE/lang/zh-cn/zh-cn.js'
// import './static/UE/ueditor.parse.js'

import './assets/fonts/iconfont.css'
import './filters/filters.js'
// import pdfjsLib from 'pdfjs-dist'
import './common/util.js'
import './common/globalSet.js'
import './common/polyfill.js'

import store from  './store'
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  mode: history,
  router,
  store,
  template: '<App/>',
  components: { App }
})


