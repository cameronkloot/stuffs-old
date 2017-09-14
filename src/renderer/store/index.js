import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import modules from './modules'

Vue.use(Vuex)

const plugins = [
  createPersistedState({
    paths: ['clips.list']
  })
]

const strict = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules,
  plugins,
  strict
})
