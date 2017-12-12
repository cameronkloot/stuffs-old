import * as types from '../mutation-types'

const namespaced = true

const state = {
  justShown: false,
  currentApp: ''
}

const mutations = {
  [types.SET_JUST_SHOWN] (state, justShown) {
    state.justShown = justShown
  },
  [types.SET_CURRENT_APP] (state, app) {
    state.currentApp = app
  }
}

const actions = {
  setJustShown ({ commit }, justShown) {
    commit(types.SET_JUST_SHOWN, justShown)
  },
  setCurrentApp ({ commit }, app) {
    commit(types.SET_CURRENT_APP, app)
  }
}

const getters = {
  justShown (state) {
    return state.justShown
  }
}

export default {
  namespaced,
  state,
  mutations,
  actions,
  getters
}
