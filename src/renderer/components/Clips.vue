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
      <p id="no-clip-results"
        v-if="list.length === 0">
        No clips yet
      </p>
      <p id="no-clip-results"
        v-else-if="filteredList.length === 0">
        No results
      </p>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapActions, mapGetters } from 'vuex'
import Clip from './Clips/Clip'

const COMMAND_HEIGHT = 74
const CLIP_HEIGHT = 48

const DIRECTIONS = {
  UP: -1,
  NONE: 0,
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
    'list'
  ]),
  filteredList () {
    const filtered = this.list.filter(clip =>
      clip.text.toLowerCase().includes(this.command.toLowerCase())
    )
    if (this.mounted === true) {
      const length = Math.min(filtered.length || 1, 10)
      const height = (CLIP_HEIGHT * length) + COMMAND_HEIGHT
      ipcRenderer.send('height', height)
    }
    return filtered
  }
}

const methods = {
  ...mapActions('clips', [
    'add',
    'remove',
    'exalt'
  ]),
  focusCommand () {
    this.$refs.command.focus()
  },
  keyDownCommand ($event) {
    $event.stopPropagation()
    if ($event.key === 'ArrowDown' && this.filteredList.length > 0) {
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

    const modified = $event.shiftKey || $event.metaKey || $event.ctrlKey
    if ($event.key === 'Backspace') {
      this.remove(this.filteredList[index].id)
    }

    let direction = DIRECTIONS.NONE
    if ($event.key === 'Tab') {
      direction = $event.shiftKey === true ? DIRECTIONS.UP : DIRECTIONS.DOWN
    } else if ($event.key === 'ArrowUp') {
      direction = DIRECTIONS.UP
    } else if ($event.key === 'ArrowDown') {
      direction = DIRECTIONS.DOWN
    }

    const nextIndex = Math.min(index + direction, this.filteredList.length - 1)
    this.$refs.clips[index].blur()
    if (nextIndex === -1) {
      this.$refs.command.focus()
    } else {
      this.$refs.clips[nextIndex].focus()
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
      mounted: false,
      scrollType: SCROLL.PROGRESS // change to option
    }
  },
  mounted () {
    this.mounted = true
    this.$refs.command.focus()

    ipcRenderer.on('show', (event, message) => {
      this.$refs.command.focus()
    })

    this.$nextTick(() => {
      window.addEventListener('keydown', this.keyDown)
    })
  },
  destroyed () {
    this.mounted = false
    this.$nextTick(() => {
      window.removeEventListener('keydown', this.keyDown)
    })
  }
}
</script>
