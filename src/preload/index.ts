import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { NativeApi } from './types'

// Custom APIs for renderer
const api: NativeApi = {
  permission: {
    request: async () => electronAPI.ipcRenderer.invoke('request-permission'),
    check: async () => electronAPI.ipcRenderer.invoke('check-permission'),
  },
  store: {
    getPresets: async () => electronAPI.ipcRenderer.invoke('get-presets'),
    setPresets: async (presets) => electronAPI.ipcRenderer.invoke('set-presets', presets),
  },
  window: {
    close: () => electronAPI.ipcRenderer.send('close-window'),
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
