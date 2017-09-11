import _ from 'lodash'
import uuidv4 from 'uuid/v4'

import * as types from '../mutation-types'

const state = {
  clips: []
}

const mutations = {
  [types.ADD_CLIP] (currentState, clip) {
    const clips = [...currentState.clips, clip]
    currentState.clips = clips
  },
  [types.REMOVE_CLIP] (currentState, clip) {
    const clips = _.reject(currentState.clips, clip)
    currentState.clips = clips
  }
}

const actions = {
  addClip ({ commit }, clip) {
    commit(types.ADD_CLIP, clip)
  },
  removeClip ({ commit }, clip) {
    commit(types.REMOVE_CLIP, clip)
  }
}

const getters = {
  clips (currentState) {
    return currentState.clips
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
