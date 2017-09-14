import uuidv4 from 'uuid/v4'
import { clipboard } from 'electron'

import * as types from '../mutation-types'

const namespaced = true

const state = {
  list: [],
  watching: true,
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
  [types.PROMOTE] (currentState, index) {
    const selected = []
    const list = currentState.list.filter((clip) => {
      if (clip.selected === true) {
        selected.push(clip)
        return false
      }
      return true
    })
    currentState.list = [...selected, ...list]
  },
  [types.SET_CURSOR] (currentState, cursor) {
    currentState.cursor = cursor
  },
  [types.SET_SELECTED] (currentState, { index, selected }) {
    // Add caching of selected id/position. have to update positions
    currentState.list[index].selected = selected
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
  },
  remove ({ state, commit }, index = false) {
    if (index === false) {
      commit(types.REMOVE_SELECTED)
    } else if (index > -1 && index < state.list.length) {
      commit(types.REMOVE_AT, index)
    }
    if (state.cursor >= state.list.length) {
      commit(types.SET_CURSOR, state.list.length - 1)
    }
    if (state.list.length > 0) {
      commit(types.SET_SELECTED, { index: state.cursor, selected: true })
    }
    if (index === 0 || index === false || state.list.length === 0) {
      // Temporary: always write first list item if removing selected items
      const text = state.list.length > 0 ? state.list[0].text : ''
      clipboard.writeText(text)
    }
  },
  promote ({ state, dispatch, commit }, index) {
    if (index === 0) {
      const clip = state.list.find(c => c.selected === true)
      clipboard.writeText(clip.text)
    }
    commit(types.PROMOTE, index)
    dispatch('setCursor', { index, key: false })
  },
  exalt ({ dispatch }) {
    dispatch('promote', 0)
  },
  setCursor ({ state, commit }, { index, key }) {
    const lastCursor = state.cursor
    if (key === false) {
      // Deselect all
      commit(types.RESET_SELECTED)
    } else if (key === 'shift') {
      // Select previous cursor
      if (lastCursor > -1 && (index > 0 && index < state.list.length)) {
        const nextSelected = state.list[index].selected
        if (nextSelected === true) {
          commit(types.SET_SELECTED, { index: lastCursor, selected: false })
        }
      }
    }

    if (index >= -1 && index < state.list.length) {
      commit(types.SET_CURSOR, index)
      if (index > -1) {
        commit(types.SET_SELECTED, { index, selected: true })
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
