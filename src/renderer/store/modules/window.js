import * as types from '../mutation-types'

const namespaced = true

const state = {
  justShown: false
}

const mutations = {
  [types.SET_JUST_SHOWN] (state, justShown) {
    state.justShown = justShown
  }
}

const actions = {
  setJustShown ({ commit }, justShown) {
    commit(types.SET_JUST_SHOWN, justShown)
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
