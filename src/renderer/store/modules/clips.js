import uuidv4 from 'uuid/v4'
import { clipboard } from 'electron'

import * as types from '../mutation-types'

const namespaced = true

const state = {
  list: [],
  cursor: -1
}

const mutations = {
  [types.ADD] (currentState, clip) {
    const list = [clip, ...currentState.list]
    currentState.list = list
  },
  [types.REMOVE_AT] (currentState, from) {
    const list = currentState.list
    list.splice(from)
    currentState.list = list
  },
  [types.REMOVE_SELECTED] (currentState) {
    currentState.list = currentState.list.filter(
      clip => clip.selected !== true
    )
  },
  [types.PROMOTE] (currentState, { from, count, to }) {
    const list = currentState.list
    const move = list.splice(from, count)
    list.splice(to, 0, ...move)
    currentState.list = list
  },
  [types.SET_CURSOR] (currentState, cursor) {
    currentState.cursor = cursor
  },
  [types.SET_SELECTED] (currentState, index) {
    // Add caching of selected id/position. have to update positions
    currentState.list[index].selected = true
  },
  [types.RESET_SELECTED] (currentState) {
    currentState.list = currentState.list.map((clip) => {
      clip.selected = false
      return clip
    })
  }
}

const actions = {
  add ({ state, dispatch, commit }, clip) {
    if (clip.text.trim().length === 0 ||
        (state.list.length > 0 && clip.text === state.list[0].text)) {
      return
    }
    if (clip.source !== 'clipboard') {
      clipboard.writeText(clip.text)
    }
    commit(types.ADD, {
      id: uuidv4(),
      selected: false,
      ...clip
    })
    if (state.cursor > -1) {
      dispatch('setCursor', state.cursor + 1)
    }
  },
  remove ({ state, commit }, index = false) {
    // move cursor?
    if (index === false) {
      commit(types.REMOVE_SELECTED)
    } else if (index > -1 && index < state.list.length) {
      commit(types.REMOVE_AT, index)
    }
    if (index === 0 || index === false) {
      // Temporary: always write first list item if removing selected items
      const text = state.list.length > 0 ? state.list[0].text : ''
      clipboard.writeText(text)
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
  setCursor ({ state, commit }, { index, key }) {
    const lastCursor = state.cursor
    if (key === false) {
      // Deselect all
      commit(types.RESET_SELECTED)
    } else if (key === 'shift') {
      // Select previous cursor
      if (lastCursor > -1) {
        commit(types.SET_SELECTED, lastCursor)
      }
    }

    if (index >= -1 && index < state.list.length) {
      commit(types.SET_CURSOR, index)
      if (index > -1) {
        commit(types.SET_SELECTED, index)
      }
    }
  }
}

const getters = {
  list (currentState) {
    return currentState.list
  },
  cursor (currentState) {
    return currentState.cursor
  }
}

export default {
  namespaced,
  state,
  mutations,
  actions,
  getters
}
