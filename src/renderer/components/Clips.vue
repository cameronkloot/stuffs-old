<template>
  <div id="clips">
    <div class="header">
      <input ref="command" class="command" type="text"
        placeholder="Type here..."
        @keydown.enter="clickAddClip"
        @keydown="keyDownCommand"
        @focus="onCommandFocus"
        v-model="command">
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
        :command="command"
        @clip-keydown="keyDownClip($event, index)"
        @clip-remove="clipRemove(index)"
        @clip-click="clipClick($event, clip, index)"
        @clip-double-click="clipDoubleClick($event, index)">
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
const CLIP_HEIGHT = 46

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
      clip.text.toLowerCase().includes(this.filter.toLowerCase())
    )
    if (this.mounted === true) {
      const length = Math.min(filtered.length || 1, 10)
      const height = (CLIP_HEIGHT * length) + COMMAND_HEIGHT
      ipcRenderer.send('height', height)
    }
    return filtered.slice(0, 100)
  }
}

const methods = {
  ...mapActions('clips', [
    'setCurrentApp',
    'add',
    'remove',
    'exalt',
    'setSelected',
    'unsetSelected'
  ]),
  focusCommand () {
    this.$refs.command.focus()
  },
  onCommandFocus () {
    this.$refs.command.selectionStart = this.command.length
    this.justShown = false // disables auto-select and hide
  },
  updateCommand () {
    if (this.updatingCommand !== null) {
      clearTimeout(this.updatingCommand)
    }
    const self = this
    this.updatingCommand = setTimeout(() => {
      self.filter = self.command
      clearTimeout(self.updatingCommand)
    }, 200)
  },
  keyDownCommand ($event) {
    // Replace with window event, only stop propagation if keys are handled in method
    // or maybe handle generally for each key event
    if ($event.key === 'Escape') {
      this.command = ''
      ipcRenderer.send('hide')
      $event.stopPropagation()
      $event.preventDefault()
    }
    if ($event.key === 'ArrowDown' && this.filteredList.length > 0) {
      this.$refs.command.blur()
      this.$refs.clips[0].$el.focus()
      $event.stopPropagation()
      $event.preventDefault()
    }
    this.updateCommand()
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
  clipClick ($event, clip, index) {
    $event.stopPropagation()
    $event.preventDefault()
    this.$refs.clips[index].$el.focus()
    if ($event.shiftKey === true) {
      this.setSelected(clip.id)
    } else {
      this.filteredList.forEach((v, i) => {
        if (v.selected === true) {
          this.unsetSelected(v.id)
        }
      })
    }
  },
  clipDoubleClick ($event, index) {
    const clip = this.filteredList[index]
    this.exalt(clip.id)
    this.$refs.clips[0].focus()
  },
  keyDownClip ($event, index) {
    $event.stopPropagation()
    $event.preventDefault()
    if ($event.key === 'Escape') { // mixin key events?
      ipcRenderer.send('hide')
    }

    let direction = DIRECTIONS.NONE
    if ($event.key === 'ArrowUp') {
      direction = DIRECTIONS.UP
    } else if ($event.key === 'ArrowDown') {
      direction = DIRECTIONS.DOWN
    }

    const clip = this.filteredList[index]
    let nextIndex = Math.min(index + direction, this.filteredList.length - 1)

    const modified = $event.shiftKey || $event.metaKey || $event.ctrlKey
    if ((this.justShown === true && $event.key === 'Backspace' && $event.metaKey === true) ||
      $event.key === 'Backspace' && modified === false) {
      this.remove(this.filteredList[index].id)

      this.justShown = false // disables auto-select and hide
    } else if ((this.justShown === true && $event.key === 'Enter' && $event.metaKey === true) ||
      $event.key === 'Enter' && modified === false) {
      if (this.currentIndex === 0 && index === 0) {
        ipcRenderer.send('hide')
        ipcRenderer.send('paste')
      } else {
        this.setSelected(clip.id)
        this.filteredList.reverse().forEach((v) => {
          if (v.selected === true) {
            this.exalt(v.id)
          }
        })
        this.command = ''
        this.filter = ''
        nextIndex = 0
      }
      this.justShown = false // disables auto-select and hide
    }

    if ($event.shiftKey === true) {
      this.setSelected(clip.id)
    } else if ($event.key !== 'Enter') { // don't clear selected if just exalted
      this.filteredList.forEach((v, i) => {
        if (v.selected === true) {
          this.unsetSelected(v.id)
        }
      })
    }

    if (nextIndex === -1) {
      this.$refs.command.focus()
    } else {
      this.$refs.clips[nextIndex].focus()
    }
    this.currentIndex = nextIndex
  },
  keyDown ($event) {

  },
  keyUp ($event) {
    const disableQuick = true
    if (this.justShown === true && $event.key === 'Meta' && disableQuick === false) {
      $event.stopPropagation()
      $event.preventDefault()
      this.justShown = false
      if (this.filteredList.length > 0 && this.currentIndex > -1) {
        const clip = this.filteredList[this.currentIndex]
        this.exalt(clip.id)
        this.$refs.clips[0].focus()
        setTimeout(() => {
          ipcRenderer.send('hide', clip.text)
        }, 100)
      }
    }
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
      updatingCommand: null,
      filter: '',
      command: '',
      mounted: false,
      justShown: false,
      currentIndex: -1,
      scrollType: SCROLL.PROGRESS // change to option
    }
  },
  mounted () {
    this.mounted = true
    this.$refs.command.focus()

    ipcRenderer.on('current-app', (event, app) => {
      console.log('app', app)
      this.setCurrentApp(app)
    })

    ipcRenderer.on('show', (event, message) => {
      // Check for meta/cmd key state via down and up handlers
      // set the meta/cmd state to down if show is run
      this.justShown = true
      if (this.filteredList.length > 0) {
        this.$refs.clips[0].focus()
      } else {
        this.$refs.command.focus()
      }
    })

    ipcRenderer.on('copycopy', (event, message) => {
      console.log('copy copy from client')
    })

    this.$nextTick(() => {
      window.addEventListener('keydown', this.keyDown)
      window.addEventListener('keyup', this.keyUp)
    })
  },
  destroyed () {
    this.mounted = false
    this.$nextTick(() => {
      window.removeEventListener('keydown', this.keyDown)
      window.removeEventListener('keyup', this.keyUp)
    })
  }
}
</script>
