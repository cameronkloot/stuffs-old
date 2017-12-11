import Vue from 'vue'
import axios from 'axios'

import 'font-awesome/css/font-awesome.min.css'
import './styles/app.css'

import App from './App'
import router from './router'
import store from './store'

const debugMenu = require('debug-menu')
debugMenu.install()

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// Prevent items from being dragged to chromium
document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
