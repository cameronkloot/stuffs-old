<template>
  <div id="app">
    <sidebar></sidebar>
    <router-view></router-view>
  </div>
</template>

<script>
import { clipboard, shortcuts } from '@/mixins'
import Sidebar from '@/components/Sidebar'

const name = 'stuffs'

const mixins = [
  clipboard,
  shortcuts
]

const components = {
  Sidebar
}

export default {
  name,
  mixins,
  components,
  mounted () {
    this.watchClipboard()
    this.registerShortcuts()
  }
}
</script>
