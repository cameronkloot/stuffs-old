import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron' // eslint-disable-line

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow = null
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`

const DEFAULT_HEIGHT = 555
const DEFAULT_WIDTH = 750

const show = () => {
  app.show()
  mainWindow.show()
  mainWindow.focus()
}

const hide = () => {
  if (mainWindow !== null) {
    mainWindow.hide()
    mainWindow.blur()
  }
  app.hide()
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
    frame: false,
    skipTaskbar: true,
    backgroundColor: '#2F3133',
    alwaysOnTop: true
    // focusable: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('show', () => {
    console.log('show')
    mainWindow.webContents.send('show', 'window show')
  })

  mainWindow.on('blur', () => {
    hide()
  })
}

ipcMain.on('height', (event, arg) => {
  if (mainWindow !== null && arg < DEFAULT_HEIGHT) {
    mainWindow.setSize(DEFAULT_WIDTH, arg)
  }
})

ipcMain.on('hide', (event, arg) => {
  hide()
})

app.on('ready', () => {
  createWindow()
  app.dock.hide()

  // Register a 'CommandOrControl+X' shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+\\', () => {
    console.log('CommandOrControl+\\ is pressed')
    if (mainWindow.isVisible()) {
      hide()
    } else {
      show()
    }
  })

  if (!ret) {
    console.log('registration failed')
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('CommandOrControl+\\'))
})

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+]')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
