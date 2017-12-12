import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'clipboard',
      component: require('@/components/Clipboard')
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/components/Settings')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
