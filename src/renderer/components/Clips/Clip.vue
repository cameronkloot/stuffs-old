<template>
  <div class="clip"
    :data-selected="clip.selected"
    :data-cursor="cursor"
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
  },
  cursor: {
    type: Boolean,
    default: false
  }
}

export default {
  name,
  props
}
</script>
