<template>
  <div id="app">
    <sidebar></sidebar>
    <router-view></router-view>
  </div>
</template>

<script>

import clipboardMixin from '@/mixins/clipboard'
import Sidebar from '@/components/Sidebar'

const name = 'stuffs'

const mixins = [
  clipboardMixin
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
  }
}
</script>
