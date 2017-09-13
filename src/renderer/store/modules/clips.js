import _ from 'lodash'
import uuidv4 from 'uuid/v4'

import * as types from '../mutation-types'

const namespaced = true

const state = {
  list: [],
  selected: -1
}

const mutations = {
  [types.ADD] (currentState, clip) {
    const list = [clip, ...currentState.list]
    currentState.list = list
  },
  [types.REMOVE] (currentState, clip) {
    const list = _.reject(currentState.list, clip)
    currentState.list = list
  },
  [types.SET_SELECTED_INDEX] (currentState, index) {
    currentState.selected = index
  }
}

const actions = {
  add ({ state, commit }, clip) {
    if (state.list.length > 0 && clip.text === state.list[0].text) {
      return
    }
    commit(types.ADD, {
      id: uuidv4(),
      ...clip
    })
    commit(types.SET_SELECTED_INDEX, 0)
  },
  remove ({ commit }, clip) {
    commit(types.REMOVE, clip)
  },
  setSelected ({ commit }, index) {
    commit(types.SET_SELECTED_INDEX, index)
  }
}

const getters = {
  list (currentState) {
    return currentState.list
  },
  selected (currentState) {
    return currentState.selected
  }
}

export default {
  namespaced,
  state,
  mutations,
  actions,
  getters
}
