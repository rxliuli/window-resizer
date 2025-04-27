import { ElectronAPI } from '@electron-toolkit/preload'
import type { NativeApi as NativeApiType } from './types'

declare global {
  interface NativeApi extends NativeApiType {}

  interface Window {
    electron: ElectronAPI
    api: NativeApi
  }
}
