<template>
  <div id="app">
    <sidebar></sidebar>
    <router-view></router-view>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapActions } from 'vuex'

import { clipboard, shortcuts } from '@/mixins'
import Sidebar from '@/components/Sidebar'

const name = 'stuffs'

const mixins = [
  clipboard,
  shortcuts
]

const methods = {
  ...mapActions('window', [
    'setJustShown',
    'setActiveWindow'
  ])
}

const components = {
  Sidebar
}

export default {
  name,
  mixins,
  methods,
  components,
  mounted () {
    this.watchClipboard()
    this.registerShortcuts()

    // Global
    ipcRenderer.on('show', () => {
      this.setJustShown(true)
    })
    ipcRenderer.on('active-window', (event, win) => {
      this.setActiveWindow(win)
    })
  }
}
</script>
