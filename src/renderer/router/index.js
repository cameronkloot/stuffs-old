import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'clips',
      component: require('@/components/Clips')
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
