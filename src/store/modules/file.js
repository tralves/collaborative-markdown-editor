import _ from 'lodash'
import {
  NEW_FILE,
  FILE_SAVED,
  FILE_SAVING,
  FILE_NOT_SAVED,
  FILE_DIRTY,
  EDIT_CONTENT,
  INSERT_CONTENT,
  DELETE_CONTENT,
  RENAME_FILE,
  LOAD_FILE
} from '../mutation-types'

export const STATUS_LIST = {
  INITIAL: 'INTIAL',
  SAVING: 'SAVING',
  SAVED: 'SAVED',
  NOT_SAVED: 'NOT_SAVED',
  DIRTY: 'DIRTY'
}

const state = {
  metadata: {
    name: 'New document',
    id: 'no-id'
  },
  content: '',
  status: STATUS_LIST.INITIAL
}

const mutations = {
  [NEW_FILE] (state, name) {
    state.metadata = {
      id: null,
      mimeType: process.env.DEFAULT_MIMETYPE,
      name: name
    }
    state.content = ''
  },

  [FILE_SAVED] (state, metadata) {
    _.assign(state.metadata, metadata)
    state.status = STATUS_LIST.SAVED
  },

  [FILE_NOT_SAVED] (state) {
    state.status = STATUS_LIST.NOT_SAVED
  },

  [FILE_SAVING] (state) {
    state.status = STATUS_LIST.SAVING
  },

  [FILE_DIRTY] (state) {
    state.status = STATUS_LIST.DIRTY
  },

  [EDIT_CONTENT] (state, content) {
    state.content = content
  },

  [INSERT_CONTENT] (state, {index, text}) {
    const content = state.content
    state.content = content.slice(0, index) + text + content.slice(index)
  },

  [DELETE_CONTENT] (state, { index, text }) {
    const content = state.content
    state.content = content.slice(0, index) + content.slice(index + text.length)
  },

  [RENAME_FILE] (state, filename) {
    state.metadata.name = filename
  },

  [LOAD_FILE] (state, file) {
    state.metadata = file.metadata
    state.content = file.content
    state.status = state.status = STATUS_LIST.SAVED
  }
}

export default {
  state,
  mutations
}
