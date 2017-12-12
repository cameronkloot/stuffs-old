import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Tray,
  Menu
} from 'electron' // eslint-disable-line
import robot from 'robotjs'

const activeWin = require('active-win')
const open = require('open')

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

let activeWindow = null

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
    backgroundColor: '#2F3133',
    alwaysOnTop: true,
    title: 'Stuffs'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('show', () => {
    mainWindow.webContents.send('show')
  })

  mainWindow.on('blur', () => {
    activeWin().then((win) => {
      if (win.app !== 'Electron') { // developer tools
        hide()
      }
    })
  })

  setInterval(() => {
    activeWin().then((win) => {
      if (activeWindow !== win) {
        activeWindow = win
        mainWindow.webContents.send('active-window', activeWindow)
      }
    })
  }, 200)
}

ipcMain.on('height', (event, arg) => {
  if (mainWindow !== null && arg < DEFAULT_HEIGHT) {
    mainWindow.setSize(DEFAULT_WIDTH, arg)
  }
})

ipcMain.on('hide', (event) => {
  hide()
})

ipcMain.on('paste', (event) => {
  setTimeout(() => {
    // If app icon is visible, requires delay...
    robot.keyTap('v', 'command')
  }, 50)
})

ipcMain.on('open', (event, url) => {
  open(url)
})

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (mainWindow) {
    show()
  }
})

if (isSecondInstance) {
  app.quit()
}

app.on('ready', () => {
  createWindow()
  // app.dock.hide()

  app.dock.setIcon(`${__static}/egg.png`)

  // Register a 'CommandOrControl+X' shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+\\', () => {
    if (mainWindow.isVisible()) {
      hide()
    } else {
      show()
    }
  })
  if (!ret) {
    // failed
  }
  // Check whether a shortcut is registered.
  // globalShortcut.isRegistered('CommandOrControl+\\')
})

app.on('will-quit', () => {
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
  } else {
    show()
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
