<template>
  <div id="clipboard">
    <div class="command-container">
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
import Clip from './Clipboard/Clip'

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

const name = 'clipboard'

const computed = {
  ...mapGetters('clipboard', [
    'list'
  ]),
  ...mapGetters('window', [
    'justShown'
  ]),
  filteredList () {
    const filter = this.filter.toLowerCase()
    const filtered = this.list.filter(clip =>
      `${clip.text} ${(clip.window || {}).app}`.toLowerCase().includes(filter)
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
  ...mapActions('clipboard', [
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
    if ($event.key === 'Escape') {
      this.command = ''
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
      this.filteredList.forEach((v) => {
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
    if ($event.metaKey && $event.code === 'KeyQ') {
      // Quit on mac
      return
    }
    $event.stopPropagation()
    $event.preventDefault()

    const clip = this.filteredList[index]
    const modified = $event.shiftKey || $event.metaKey || $event.ctrlKey

    if ($event.code === 'KeyO') {
      ipcRenderer.send('open', clip.text)
      return
    }

    let direction = DIRECTIONS.NONE
    if ($event.key === 'ArrowUp') {
      direction = DIRECTIONS.UP
    } else if ($event.key === 'ArrowDown') {
      direction = DIRECTIONS.DOWN
    }

    let nextIndex = Math.min(index + direction, this.filteredList.length - 1)

    if ((this.justShown === true && $event.key === 'Backspace' && $event.metaKey === true) ||
      ($event.key === 'Backspace' && modified === false)) {
      this.remove(this.filteredList[index].id)
    } else if ((this.justShown === true && $event.key === 'Enter' && $event.metaKey === true) ||
      ($event.key === 'Enter' && modified === false)) {
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
    }

    if ($event.shiftKey === true) {
      this.setSelected(clip.id)
    } else if ($event.key !== 'Enter') { // don't clear selected if just exalted
      this.$nextTick(() => {
        this.filteredList.forEach((v) => {
          if (v.selected === true) {
            this.unsetSelected(v.id)
          }
        })
      })
    }

    if (nextIndex === -1) {
      this.$refs.command.focus()
    } else {
      this.$refs.clips[nextIndex].focus()
    }
    this.currentIndex = nextIndex
  },
  keyUp ($event) {
    const disableQuick = true
    if (this.justShown === true && $event.key === 'Meta' && disableQuick === false) {
      $event.stopPropagation()
      $event.preventDefault()
      if (this.filteredList.length > 0 && this.currentIndex > -1) {
        const clip = this.filteredList[this.currentIndex]
        this.exalt(clip.id)
        this.$refs.clips[0].focus()
        setTimeout(() => {
          ipcRenderer.send('hide')
          ipcRenderer.send('paste')
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
      currentIndex: -1,
      scrollType: SCROLL.PROGRESS // change to option
    }
  },
  mounted () {
    this.mounted = true
    this.$refs.command.focus()

    ipcRenderer.on('show', () => {
      // Check for meta/cmd key state via down and up handlers
      // set the meta/cmd state to down if show is run
      if (this.filteredList.length > 0) {
        this.$refs.clips[0].focus()
      } else {
        this.$refs.command.focus()
      }
    })

    this.$nextTick(() => {
      window.addEventListener('keyup', this.keyUp)
    })
  },
  destroyed () {
    this.mounted = false
    this.$nextTick(() => {
      window.removeEventListener('keyup', this.keyUp)
    })
  }
}
</script>
