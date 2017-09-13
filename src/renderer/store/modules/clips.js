import _ from 'lodash'
import uuidv4 from 'uuid/v4'
import { clipboard } from 'electron'

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
  [types.REMOVE] (currentState, { from, count }) {
    const list = currentState.list
    list.splice(from, count)
    currentState.list = list
  },
  [types.PROMOTE] (currentState, { from, count, to }) {
    const list = currentState.list
    const move = list.splice(from, count)
    list.splice(to, 0, ...move)
    currentState.list = list
  },
  [types.SET_SELECTED_INDEX] (currentState, index) {
    currentState.selected = index
  }
}

const actions = {
  add ({ state, commit }, clip) {
    if (clip.text.trim().length === 0 ||
        (state.list.length > 0 && clip.text === state.list[0].text)) {
      return
    }
    if (clip.source !== 'clipboard') {
      clipboard.writeText(clip.text)
    }
    commit(types.ADD, {
      id: uuidv4(),
      ...clip
    })
  },
  remove ({ state, dispatch, commit }, { from, count }) {
    commit(types.REMOVE, { from, count })
    if (from === 0 && state.list.length > 0) {
      clipboard.writeText(state.list[0].text)
    } else {
      clipboard.clear()
    }
  },
  promote ({ state, dispatch, commit }, { from, count, to }) {
    if (to === 0) {
      clipboard.writeText(state.list[from].text)
    }
    commit(types.PROMOTE, { from, count, to })
    dispatch('setSelected', to)
  },
  exalt ({ dispatch }, { from, count }) {
    dispatch('promote', { from, count, to: 0 })
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
