<template>
  <div id="clips">
    <div class="header">
      <input
        class="command"
        type="text"
        placeholder="Type here..."
        v-model="command">
      </input>
      <button class="add"
        v-show="command.length > 0"
        @click="clickAddClip">
        ADD
      </button>
    </div>
    <div class="clips-container">
      <div v-for="clip in clips" :key="clip.id" class="clip">
        <span class="text">{{ clip.text }}</span>
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
    'addClip'
  ]),
  clickAddClip () {
    this.addClip({
      text: this.command
    })
    this.command = ''
  }
}

export default {
  name,
  computed,
  methods,
  data () {
    return {
      command: ''
    }
  }
}
</script>
