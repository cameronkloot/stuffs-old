import * as types from '../mutation-types'

const namespaced = true

const state = {
  justShown: false,
  activeWindow: {}
}

const mutations = {
  [types.SET_JUST_SHOWN] (state, justShown) {
    state.justShown = justShown
  },
  [types.SET_ACTIVE_WINDOW] (state, win) {
    state.activeWindow = win
  }
}

const actions = {
  setJustShown ({ commit }, justShown) {
    commit(types.SET_JUST_SHOWN, justShown)
  },
  setActiveWindow ({ commit }, win) {
    commit(types.SET_ACTIVE_WINDOW, win)
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
