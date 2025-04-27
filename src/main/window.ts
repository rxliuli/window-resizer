import { BrowserWindow, shell } from 'electron'
import icon from '../../resources/icon.png?asset'
import { fileURLToPath } from 'url'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'

function createWindow(path: string) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
      sandbox: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#' + path)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: path })
  }
  return mainWindow
}

let settingsWindow: BrowserWindow | null = null
export function createSettingsWindow(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.show()
    return
  }
  settingsWindow = createWindow('/')
}

let permissionWindow: BrowserWindow | null = null
export function createPermissionWindow(): void {
  if (permissionWindow && !permissionWindow.isDestroyed()) {
    permissionWindow.show()
    return
  }
  permissionWindow = createWindow('/permission')
}
