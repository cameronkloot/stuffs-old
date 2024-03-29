import { clipboard } from 'electron'
import { mapActions } from 'vuex'

const methods = {
  ...mapActions('clipboard', [
    'add'
  ]),
  watchClipboard () {
    const self = this
    let lastText = clipboard.readText()
    let lastImage = clipboard.readImage()
    // let lastImageDataUrl = lastImage.toDataURL()
    let lastImageSize = lastImage.getSize()

    const checkImage = (image) => {
      const size = image.getSize()
      // add data url check if size matches
      return size.width !== lastImageSize.width &&
        size.height !== lastImageSize.height
    }

    setInterval(() => {
      const text = clipboard.readText()
      const image = clipboard.readImage()
      if (image.isEmpty() === false && checkImage(image) === true) {
        self.add({
          text,
          image,
          type: 'image',
          source: 'clipboard'
        })
        lastImage = image
        // lastImageDataUrl = image.toDataURL()
        lastImageSize = image.getSize()
      } else if (text && text !== lastText) {
        self.add({
          text,
          type: 'text',
          source: 'clipboard'
        })
        lastText = text
      }
    }, 100)
  }
}

export default {
  methods
}
