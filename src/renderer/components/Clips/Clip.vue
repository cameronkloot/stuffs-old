<template>
  <div ref="clip" class="clip" tabindex="-1"
    :data-selected="clip.selected"
    @keydown="$emit('clip-keydown', $event)"
    @click="$emit('clip-click', $event)">
    <span class="text truncate">{{ clip.text }}</span>
    <span class="buttons">
      <button class="remove" @click="$emit('clip-remove')">X</button>
    </span>
  </div>
</template>

<script>
const name = 'clips_clip'

const props = {
  clip: {
    type: Object,
    required: true
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
  methods
}
</script>
