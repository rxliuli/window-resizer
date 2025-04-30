import { ulid } from 'ulid'
import { NativeApi } from '../types'

export function browser(): NativeApi {
  const STORAGE_KEY = 'window-resizer-presets'
  return {
    permission: {
      request: async () => {
        window.open(
          'x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility',
        )
      },
      check: async () => {
        return true
      },
    },
    store: {
      getPresets: async () => {
        const data = localStorage.getItem(STORAGE_KEY)
        return data
          ? JSON.parse(data)
          : [{ id: ulid(), width: 1280, height: 800 }]
      },
      setPresets: async (presets) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
      },
    },
    window: {
      close: async () => {
        window.close()
      },
    },
  }
}
