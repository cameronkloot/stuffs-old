<template>
  <div class="clip" :data-selected="selected">
    <span class="text truncate">{{ clip.text }}</span>
    <span class="buttons">
      <button class="remove" @click="$emit('clip-remove', clip)">X</button>
    </span>
  </div>
</template>

<script>
const name = 'clips_clip'

const props = {
  clip: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
}

export default {
  name,
  props
}
</script>
