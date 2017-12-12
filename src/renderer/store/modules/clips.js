import uuidv4 from 'uuid/v4'
import { clipboard } from 'electron'

import * as types from '../mutation-types'

const namespaced = true

const state = {
  list: []
}

const mutations = {

  [types.ADD] (state, clip) {
    const list = [clip, ...state.list]
    state.list = list
  },
  [types.REMOVE] (state, index) {
    state.list.splice(index, 1)
  },
  [types.PROMOTE] (state, { index, to }) {
    const clips = state.list.splice(index, 1)
    // console.log(clip)
    state.list.splice(to, 0, ...clips)
    // state.list = [clip, ...state.list]

    // const selected = []
    // const list = state.list.filter((clip) => {
    //   if (clip.selected === true) {
    //     selected.push(clip)
    //     return false
    //   }
    //   return true
    // })
    // state.list = [...selected, ...list]
  },
  [types.SET_SELECTED] (state, id) {
    const index = state.list.findIndex(clip => clip.id === id)
    state.list[index].selected = true
  },
  [types.UNSET_SELECTED] (state, id) {
    const index = state.list.findIndex(clip => clip.id === id)
    state.list[index].selected = false
  }
}

const actions = {
  add ({ state, commit, rootState }, clip) {
    if (clip.text.trim().length === 0 ||
        (state.list.length > 0 && clip.text === state.list[0].text)) {
      return
    }
    if (clip.source !== 'clipboard') {
      clipboard.writeText(clip.text)
      if (clipboard.readText() !== clip.text) {
        console.error('There was a problem with the clipboard')
      }
    }
    let category = ''
    if (clip.text.startsWith('http') || clip.text.startsWith('www') || clip.text.startsWith('localhost')) {
      category = 'link'
    }
    commit(types.ADD, {
      id: uuidv4(),
      selected: false,
      length: clip.text.length,
      window: rootState.window.activeWindow,
      category,
      ...clip
    })
  },
  remove ({ state, commit }, id) {
    const index = state.list.findIndex(clip => clip.id === id)
    if (index === 0 && state.list.length > 1) {
      clipboard.writeText(state.list[1].text)
    } else if (state.list.length === 1) {
      clipboard.writeText('')
    }
    commit(types.REMOVE, index)
  },
  promote ({ state, commit }, { id, to }) {
    const index = state.list.findIndex(clip => clip.id === id)
    if (to === 0) {
      const clip = state.list[index]
      if (clip.type === 'text') {
        clipboard.writeText(clip.text)
      } else if (clip.type === 'image') {
        clipboard.write({
          text: clip.text,
          image: clip.image
        }, 'image')
      }
      if (clipboard.readText() !== clip.text) {
        console.error('There was a problem with the clipboard')
      }
    }
    commit(types.PROMOTE, { index, to })
  },
  exalt ({ dispatch }, id) {
    dispatch('promote', { id, to: 0 })
  },
  setSelected ({ commit }, id) {
    commit(types.SET_SELECTED, id)
  },
  unsetSelected ({ commit }, id) {
    commit(types.UNSET_SELECTED, id)
  }
}

const getters = {
  list (state) {
    return state.list
  }
}

export default {
  namespaced,
  state,
  mutations,
  actions,
  getters
}
