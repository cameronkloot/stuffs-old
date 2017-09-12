<template>
  <div id="clips">
    <div class="header">
      <input autofocus
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
    <div class="clips-container" ref="list">
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

const name = 'clips'

const computed = {
  ...mapGetters('clips', ['list', 'selected'])
}

const methods = {
  ...mapActions('clips', [
    'add',
    'remove',
    'setSelected'
  ]),
  clickAddClip () {
    if (this.command.trim().length > 0) {
      this.add({
        text: this.command
      })
      this.command = ''
    }
  },
  clipRemove (clip) {
    this.remove(clip)
  },
  keydownSelectClips ($event) {
    let direction = null
    if ($event.key === 'Tab') {
      $event.preventDefault()
      $event.stopPropagation()
      direction = $event.shiftKey === true ? DIRECTIONS.UP : DIRECTIONS.DOWN
    } else if ($event.key === 'ArrowUp') {
      direction = DIRECTIONS.UP
    } else if ($event.key === 'ArrowDown') {
      direction = DIRECTIONS.DOWN
    }

    if (direction === DIRECTIONS.UP || direction === DIRECTIONS.DOWN) {
      // Increment/decrement selection
      if (direction === DIRECTIONS.UP && this.selected > -1) {
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

      this.scrollListToSelected()
    }
  },
  scrollListToSelected () {
    if (this.selected > -1) {
      // Scroll to keep selected in view
      const command = this.$refs.command
      const list = this.$refs.list
      const clip = this.$refs.clips[this.selected].$el
      list.scrollTop = clip.offsetTop - command.offsetHeight
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
      command: ''
    }
  },
  mounted () {
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
