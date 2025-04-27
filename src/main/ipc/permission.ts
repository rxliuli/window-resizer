import { systemPreferences } from 'electron'
import { platform } from 'os'
import { triggerPermissionDialog } from '../resize'

class PermissionApi {
  check(): boolean {
    if (platform() !== 'darwin') {
      throw new Error('Accessibility check is only applicable on macOS.')
    }
    const isTrusted = systemPreferences.isTrustedAccessibilityClient(false)
    console.log(`Accessibility permission check: ${isTrusted}`)
    return isTrusted
  }
  request() {
    if (platform() !== 'darwin') {
      throw new Error('Accessibility check is only applicable on macOS.')
    }
    const isTrusted = systemPreferences.isTrustedAccessibilityClient(true)
    console.log(`Accessibility permission request: ${isTrusted}`)
    triggerPermissionDialog()
    return isTrusted
  }
}

export const permissionApi = new PermissionApi()
