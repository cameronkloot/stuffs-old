import { ipcRenderer } from 'electron'
import { mapActions } from 'vuex'

const methods = {
  ...mapActions('window', [
    'setJustShown'
  ]),
  registerShortcuts () {
    this.$nextTick(() => {
      window.addEventListener('keyup', this.keyUp)
    })
  },
  keyUp ($event) {
    // console.log($event.code, $event)
    let propagate = false
    // Hide window
    if ($event.key === 'Escape') {
      ipcRenderer.send('hide')
    } else if ($event.key === 'Meta') {
      // TODO windows/linux keys
      this.setJustShown(false)
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
