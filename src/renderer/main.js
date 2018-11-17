import Vue from 'vue'

import 'font-awesome/css/font-awesome.min.css'
import './styles/app.css'

import App from './App'
import router from './router'
import store from './store'

const debugMenu = require('debug-menu')
debugMenu.install()

Vue.use(require('vue-electron'))
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
