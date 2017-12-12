<template>
  <div ref="clip" class="clip" tabindex="-1"
    :data-selected="clip.selected"
    :data-filtering="command !== ''"
    @keydown="$emit('clip-keydown', $event)"
    @click="$emit('clip-click', $event)"
    @dblclick="$emit('clip-double-click', $event)">
    <pre v-if="textType === 'pre'" class="text">{{ clip.text }}</pre>
    <span v-else class="text truncate" v-html="clipText"></span>
    <span class="info">
      <span class="app" v-if="clip.window" :title="clip.window.title">{{ clip.window.app }}|</span>
      <span class="length">{{ clip.text.length }}</span>
      <button class="remove" @click="$emit('clip-remove')">X</button>
    </span>
  </div>
</template>

<script>
import escape from 'lodash/escape'

const name = 'clipboard_clip'

const props = {
  clip: {
    type: Object,
    required: true
  },
  command: {
    type: String,
    required: true
  }
}

const computed = {
  clipText () {
    const text = escape(this.clip.text.slice(0, 100))
    if (this.command !== '') {
      return text.replace(this.command, `<b class="highlight">${this.command}</b>`)
    }
    return text
  }
}

const methods = {
  blur () {
    this.$el.blur()
  },
  focus () {
    this.$el.focus()
    this.$el.scrollIntoView(false)
  }
}

export default {
  name,
  props,
  computed,
  methods,
  data () {
    return {
      textType: '' // 'pre'
    }
  }
}
</script>
