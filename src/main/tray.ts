import { app, Menu, MenuItemConstructorOptions, nativeImage, Tray } from 'electron'
import icon from '../../resources/tray-icon.png?asset'
import { createSettingsWindow } from './window'
import { storeApi } from './ipc/store'
import { resizeWindow } from './resize'

let tray: Tray | null = null

export function createTray() {
  // https://github.com/electron/electron/issues/27128#issuecomment-751545353
  // https://stackoverflow.com/questions/41664208/electron-tray-icon-change-depending-on-dark-theme/41998326#41998326
  const trayIcon = nativeImage.createFromPath(icon).resize({ width: 18, height: 18 })
  tray = new Tray(trayIcon)
  tray.setToolTip('Window Resizer')
  refreshTrayMenus()
}

export function refreshTrayMenus() {
  const presets = storeApi.getPresets()
  const contextMenu = Menu.buildFromTemplate([
    ...presets.map(
      (preset) =>
        ({
          type: 'normal',
          id: preset.id,
          label: `Resize to ${preset.width}x${preset.height}`,
          click: () => resizeWindow(preset.width, preset.height),
        }) satisfies MenuItemConstructorOptions,
    ),
    { type: 'separator' },
    {
      type: 'normal',
      id: 'preferences',
      label: 'Preferences',
      accelerator: 'CmdOrCtrl+,',
      click: () => {
        createSettingsWindow()
      },
    },
    { type: 'normal', id: 'quit', label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
  ])

  tray!.setContextMenu(contextMenu)
}
