<template>
  <div id="clips">
    <div class="header">
      <input
        class="command"
        ref="command"
        type="text"
        placeholder="Type here..."
        v-model="command"
        @keydown.enter="clickAddClip"
        @focus="setSelected(-1)">
      </input>
      <button class="add"
        v-show="command.length > 0"
        @click="clickAddClip">
        ADD
      </button>
    </div>
    <div class="clips-container" ref="list" :data-scroll-type="this.scrollType">
      <Clip
        v-for="(clip, index) in list"
        :key="clip.id"
        ref="clips"
        :selected="selected === index"
        :clip="clip"
        @clip-remove="clipRemove">
      </Clip>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Clip from './Clips/Clip'

const DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN'
}

const SCROLL = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  DIRECTION: 'DIRECTION',
  PROGRESS: 'PROGRESS' // could disable scrollbar with this option
}

const name = 'clips'

const computed = {
  ...mapGetters('clips', ['list', 'selected'])
}

const watch = {
  list () {
    this.scrollListToSelected()
  }
}

const methods = {
  ...mapActions('clips', [
    'add',
    'remove',
    'exalt',
    'setSelected'
  ]),
  clickAddClip () {
    if (this.command.trim().length > 0) {
      this.add({
        text: this.command,
        source: 'command'
      })
      this.command = ''
    }
  },
  clipRemove (clip) {
    this.remove(clip)
  },
  keydownSelectClips ($event) {
    // Move to mixin
    if ($event.key === 'Backspace' && this.selected > -1) {
      this.clipRemove(this.list[this.selected])
      return
    }

    if ($event.key === 'Enter' && this.selected > -1) {
      this.exalt({ from: this.selected, count: 1 })
      return
    }

    let direction = null
    if ($event.key === 'Tab') {
      direction = $event.shiftKey === true ? DIRECTIONS.UP : DIRECTIONS.DOWN
    } else if ($event.key === 'ArrowUp') {
      direction = DIRECTIONS.UP
    } else if ($event.key === 'ArrowDown') {
      direction = DIRECTIONS.DOWN
    }

    if (direction === DIRECTIONS.UP || direction === DIRECTIONS.DOWN) {
      $event.preventDefault()
      $event.stopPropagation()
      // do a check for windows/control key rather than metakey
      if (direction === DIRECTIONS.UP && $event.metaKey === true) {
        this.setSelected(-1)
      } else if (direction === DIRECTIONS.DOWN && $event.metaKey === true) {
        this.setSelected(this.list.length - 1)
      } else if (direction === DIRECTIONS.UP && this.selected > -1) {
        this.setSelected(this.selected - 1)
      } else if (direction === DIRECTIONS.DOWN && this.selected < this.list.length - 1) {
        this.setSelected(this.selected + 1)
      }

      // Focus in/out on command input
      if (this.selected === -1) {
        this.$refs.command.focus()
      } else {
        this.$refs.command.blur()
      }

      this.scrollListToSelected(direction)
    }
  },
  scrollListToSelected (direction) {
    if (this.selected > -1 && this.list.length > 1) {
      const index = this.selected > -1 ? this.selected : 0
      // Scroll to keep selected in view
      const command = this.$refs.command
      const list = this.$refs.list
      const clip = this.$refs.clips[index].$el

      let tempScrollType = this.scrollType
      if (tempScrollType === SCROLL.DIRECTION) {
        // Implement separately with normal scrolling in between top and bottom
        tempScrollType = direction === DIRECTIONS.UP ? SCROLL.TOP : SCROLL.BOTTOM
      }
      switch (tempScrollType) {
        case SCROLL.PROGRESS:
          list.scrollTop = (clip.offsetHeight * index) -
            index * (list.offsetHeight - clip.offsetHeight) / this.list.length
          break
        case SCROLL.DIRECTION && direction === DIRECTIONS.UP:
        case SCROLL.TOP:
          list.scrollTop = clip.offsetHeight * index
          break
        case SCROLL.DIRECTION && direction === DIRECTIONS.DOWN:
        case SCROLL.BOTTOM:
        default:
          list.scrollTop = clip.offsetTop + clip.offsetHeight -
            list.offsetHeight - command.offsetHeight
          break
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
  watch,
  methods,
  components,
  data () {
    return {
      command: '',
      scrollType: SCROLL.PROGRESS // change to option
    }
  },
  mounted () {
    if (this.selected >= this.list.length) {
      // for DEBUG only
      this.setSelected(0)
    }
    this.$nextTick(() => {
      this.scrollListToSelected()
      window.addEventListener('keydown', this.keydownSelectClips)
    })
  },
  destroyed () {
    this.$nextTick(() => {
      window.removeEventListener('keydown', this.keydownSelectClips)
    })
  }
}
</script>
