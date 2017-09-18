<template>
  <div id="clips">
    <div class="header">
      <input ref="command" class="command" type="text"
        placeholder="Type here..."
        v-model="command"
        @keydown.enter="clickAddClip"
        @keydown="keyDownCommand">
      </input>
      <button class="add"
        v-show="command.length > 0"
        @click="clickAddClip">
        ADD
      </button>
    </div>
    <div class="clips-container" ref="list" :data-scroll-type="this.scrollType">
      <Clip ref="clips"
        v-for="(clip, index) in filteredList" :key="index"
        :clip="clip"
        @clip-keydown="keyDownClip($event, index)"
        @clip-remove="clipRemove(index)"
        @clip-click="clipClick($event, index)">
      </Clip>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapActions, mapGetters } from 'vuex'
import Clip from './Clips/Clip'

const DIRECTIONS = {
  UP: -1,
  DOWN: 1
}

const SCROLL = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  DIRECTION: 'DIRECTION',
  PROGRESS: 'PROGRESS' // could disable scrollbar with this option
}

const name = 'clips'

const computed = {
  ...mapGetters('clips', [
    'list',
    'cursor'
  ]),
  filteredList () {
    return this.list.filter(clip =>
      clip.text.toLowerCase().includes(this.command.toLowerCase())
    )
  }
}

const methods = {
  ...mapActions('clips', [
    'add',
    'remove',
    'exalt',
    'setCursor'
  ]),
  focusCommand () {
    this.$refs.command.focus()
  },
  keyDownCommand ($event) {
    $event.stopPropagation()
    if ($event.key === 'ArrowDown' && this.filteredList.length > 0) {
      console.log(this.$refs.clips[0])
      this.$refs.command.blur()
      this.$refs.clips[0].$el.focus()
    }
  },
  clickAddClip () {
    if (this.command.trim().length > 0) {
      this.add({
        text: this.command,
        source: 'command'
      })
      this.command = ''
    }
  },
  clipRemove (index) {
    this.remove(this.filteredList[index].id)
  },
  clipClick ($event, index) {
    $event.stopPropagation()
    $event.preventDefault()
    this.$refs.clips[index].$el.focus()
  },
  keyDownClip ($event, index) {
    $event.stopPropagation()
    $event.preventDefault()
    if ($event.key === 'ArrowDown') {
      if (index + 1 < this.filteredList.length) {
        this.$refs.clips[index].$el.blur()
        this.$refs.clips[index + 1].$el.focus()
        this.$refs.clips[index + 1].$el.scrollIntoView(false)
      }
    } else if ($event.key === 'ArrowUp') {
      this.$refs.clips[index].$el.blur()
      if (index > 0) {
        this.$refs.clips[index - 1].$el.focus()
        this.$refs.clips[index - 1].$el.scrollIntoView(false)
      } else {
        this.$refs.command.focus()
      }
    } else if ($event.key === 'Backspace') { // check for modifiers
      this.$refs.clips[index].$el.blur()
      this.remove(this.filteredList[index].id)
      const next = index + 1
      if (this.filteredList.length === 0) {
        this.$refs.command.focus()
      } else {
        const nextIndex = index < this.filteredList.length ? index : this.filteredList.length - 1
        this.$refs.clips[nextIndex].$el.focus()
        this.$refs.clips[nextIndex].$el.scrollIntoView(false)
      }
    }
  },
  keyDown ($event) {

  }
}

const components = {
  Clip
}

export default {
  name,
  computed,
  methods,
  components,
  data () {
    return {
      command: '',
      scrollType: SCROLL.PROGRESS // change to option
    }
  },
  mounted () {
    this.$refs.command.focus()

    ipcRenderer.on('show', (event, message) => {
      this.$refs.command.focus()
    })

    this.$nextTick(() => {
      window.addEventListener('keydown', this.keyDown)
    })
  },
  destroyed () {
    this.$nextTick(() => {
      window.removeEventListener('keydown', this.keyDown)
    })
  }
}
</script>
