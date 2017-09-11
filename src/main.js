// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import '../theme/index.css'
import './assets/fonts/iconfont.css'
import './assets/fonts/iconfont.js'
import './filters/filters.js'
import pdfjsLib from 'pdfjs-dist'
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  mode: history,
  router,
  template: '<App/>',
  components: { App }
})


