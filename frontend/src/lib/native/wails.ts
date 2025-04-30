import { NativeApi } from '../types'
import { GreetService } from '../../../bindings/window-resizer'

export function wails(): NativeApi {
  return {
    permission: {
      request: async () => {
        await GreetService.RequestPermission()
      },
      check: async () => {
        return GreetService.CheckPermission()
      },
    },
    store: {
      getPresets: async () => {
        const presets = await GreetService.GetPresets()
        return presets
      },
      setPresets: async (presets) => {
        await GreetService.SetPresets(presets)
      },
    },
    window: {
      close: async () => {
        await GreetService.ClosePermissionWindow()
      },
    },
  }
}
