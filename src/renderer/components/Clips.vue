<template>
  <div id="clips">
    <div class="header">
      <input class="command"
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
    if ($event.key !== 'ArrowUp' && $event.key !== 'ArrowDown') {
      return
    }

    // Increment/decrement selection
    if ($event.key === 'ArrowUp' && this.selected > -1) {
      this.setSelected(this.selected - 1)
    } else if ($event.key === 'ArrowDown' && this.selected < this.list.length - 1) {
      this.setSelected(this.selected + 1)
    }

    if (this.selected === -1) {
      // Focus on command input
      this.$refs.command.focus()
    } else {
      this.$refs.command.blur()

      // Scroll to keep selected in view
      const command = this.$refs.command
      const list = this.$refs.list
      const clip = this.$refs.clips[this.selected].$el

      let scrollTop = list.scrollTop
      if (clip.offsetTop + clip.offsetHeight >
        list.scrollTop + list.offsetHeight + command.offsetHeight) {
        scrollTop += clip.offsetHeight
        list.scrollTop = scrollTop > list.scrollHeight ? list.scrollHeight : scrollTop
      } else if (clip.offsetTop < list.scrollTop + command.offsetHeight) {
        scrollTop -= clip.offsetHeight
        list.scrollTop = scrollTop < 0 ? 0 : scrollTop
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
      command: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
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
