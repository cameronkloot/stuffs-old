import { ipcRenderer } from 'electron'

const methods = {
  registerShortcuts () {
    this.$nextTick(() => {
      window.addEventListener('keyup', this.keyUp)
    })
  },
  keyUp ($event) {
    let propagate = false
    // Hide window
    if ($event.key === 'Escape') {
      ipcRenderer.send('hide')
    } else {
      propagate = true
    }

    // Prevent event from propagating
    if (propagate === false) {
      $event.preventDefault()
      $event.stopPropagation()
    }
  }
}

export default {
  methods
}
