<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { clipboard } from 'electron'
import { mapActions } from 'vuex'

const name = 'stuffs'

const methods = {
  ...mapActions('clips', [
    'add'
  ])
}

export default {
  name,
  methods,
  mounted () {
    const thisContext = this
    setInterval(() => {
      const text = clipboard.readText()
      thisContext.add({ text })
    }, 100)
  }
}
</script>
