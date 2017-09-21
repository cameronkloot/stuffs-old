import uuidv4 from 'uuid/v4'
import { clipboard } from 'electron'

import * as types from '../mutation-types'

const namespaced = true

const state = {
  list: []
}

const mutations = {
  [types.ADD] (currentState, clip) {
    const list = [clip, ...currentState.list]
    currentState.list = list
  },
  [types.REMOVE] (currentState, index) {
    currentState.list.splice(index, 1)
  },
  [types.PROMOTE] (currentState, { index, to }) {
    const clips = currentState.list.splice(index, 1)
    // console.log(clip)
    currentState.list.splice(to, 0, ...clips)
    // currentState.list = [clip, ...currentState.list]

    // const selected = []
    // const list = currentState.list.filter((clip) => {
    //   if (clip.selected === true) {
    //     selected.push(clip)
    //     return false
    //   }
    //   return true
    // })
    // currentState.list = [...selected, ...list]
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
      if (clipboard.readText() !== clip.text) {
        console.log('There was a problem with the clipboard')
      }
    }
    commit(types.ADD, {
      id: uuidv4(),
      selected: false,
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
        console.log('There was a problem with the clipboard')
      }
    }
    commit(types.PROMOTE, { index, to })
  },
  exalt ({ dispatch }, id) {
    dispatch('promote', { id, to: 0 })
  }
}

const getters = {
  list (currentState) {
    return currentState.list
  }
}

export default {
  namespaced,
  state,
  mutations,
  actions,
  getters
}
