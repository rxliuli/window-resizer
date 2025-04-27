import { BrowserWindow, WebContents } from 'electron'

class WindowApi {
  close(sender: WebContents) {
    const win = BrowserWindow.fromWebContents(sender)
    if (win) {
      win.close()
    }
  }
}

export const windowApi = new WindowApi()
