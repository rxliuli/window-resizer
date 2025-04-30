export interface PresetSize {
  id: string
  width: number
  height: number
}

export interface NativeApi {
  permission: {
    request: () => Promise<void>
    check: () => Promise<boolean>
  }
  store: {
    getPresets: () => Promise<PresetSize[]>
    setPresets: (presets: PresetSize[]) => Promise<void>
  }
  window: {
    close: () => Promise<void>
  }
}
