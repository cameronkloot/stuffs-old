<template>
  <div id="clips">
    <div class="header">
      <input class="command"
        ref="command"
        type="text"
        placeholder="Type here..."
        v-model="command"
        @keydown.enter="clickAddClip"
        @focus="selected = -1">
      </input>
      <button class="add"
        v-show="command.length > 0"
        @click="clickAddClip">
        ADD
      </button>
    </div>
    <div class="clips-container" ref="list">
      <div class="clip"
        v-for="(clip, index) in clips"
        :key="clip.id"
        ref="clips"
        :data-selected="selected === index"
        :selected="selected === index">
        <span class="text">{{ clip.text }}</span>
        <span class="buttons">
          <button class="remove" @click="clickRemoveClip(clip)">X</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const name = 'clips'

const computed = {
  ...mapGetters([
    'clips'
  ])
}

const methods = {
  ...mapActions([
    'addClip',
    'removeClip'
  ]),
  clickAddClip () {
    if (this.command.trim().length > 0) {
      this.addClip({
        text: this.command
      })
      this.command = ''
    }
  },
  clickRemoveClip (clip) {
    this.removeClip(clip)
  },
  keydownSelectClips ($event) {
    if ($event.key !== 'ArrowUp' && $event.key !== 'ArrowDown') {
      return
    }

    // Increment/decrement selection
    if ($event.key === 'ArrowUp') {
      this.selected = this.selected > -1 ? this.selected - 1 : -1
    } else if ($event.key === 'ArrowDown') {
      this.selected = this.selected < this.clips.length - 1 ? this.selected + 1 : this.selected
    }

    if (this.selected === -1) {
      // Focus on command input
      this.$refs.command.focus()
    } else {
      this.$refs.command.blur()

      // Scroll to keep selected in view
      const command = this.$refs.command
      const list = this.$refs.list
      const clip = this.$refs.clips[this.selected]

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

export default {
  name,
  computed,
  methods,
  data () {
    return {
      command: '',
      selected: -1
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
