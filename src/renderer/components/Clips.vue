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
        @focus="setCursor({ index: -1, key: false })">
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
        :cursor="cursor === index"
        :clip="clip"
        @clip-remove="clipRemove(index)"
        @clip-click="clipClick($event, index)">
      </Clip>
    </div>
  </div>
</template>

<script>
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
  ])
}

const watch = {
  cursor () {
    this.scrollToCursor()
    if (this.cursor === -1 && this.list.length === 0) {
      this.$refs.command.focus()
    }
  }
}

const methods = {
  ...mapActions('clips', [
    'add',
    'remove',
    'exalt',
    'setCursor'
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
  clipRemove (index) {
    this.remove(index)
  },
  clipClick ($event, index) {
    this.setCursor({ index, key: false })
  },
  keyDown ($event) {
    if (this.list.length === 0) {
      return
    }
    // Move to mixin
    if ($event.key === 'Backspace' && this.cursor > -1) {
      this.remove()
      return
    }

    if ($event.key === 'Enter' && this.cursor > -1) {
      this.exalt()
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

      const index = this.cursor + direction // +/- 1
      const key = $event.shiftKey ? 'shift' : false
      this.setCursor({ index, key })

      // Focus in/out on command input
      if (this.cursor === -1) {
        this.$refs.command.focus()
      } else {
        this.$refs.command.blur()
      }

      // this.scrollToCursor(direction)
    }
  },
  scrollToCursor (direction = 'NONE') {
    if (this.list.length > 1 && this.cursor > -1) {
      // Scroll to keep cursor in view
      const command = this.$refs.command
      const list = this.$refs.list
      const clip = this.$refs.clips[this.cursor].$el

      let tempScrollType = this.scrollType
      if (tempScrollType === SCROLL.DIRECTION) {
        // Implement separately with normal scrolling in between top and bottom
        tempScrollType = direction === DIRECTIONS.UP ? SCROLL.TOP : SCROLL.BOTTOM
      }
      switch (tempScrollType) {
        case SCROLL.PROGRESS:
          list.scrollTop = (clip.offsetHeight * this.cursor) -
            (this.cursor / this.list.length) * (list.offsetHeight - clip.offsetHeight)
          break
        case SCROLL.DIRECTION && direction === DIRECTIONS.UP:
        case SCROLL.TOP:
          list.scrollTop = clip.offsetHeight * this.cursor
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
