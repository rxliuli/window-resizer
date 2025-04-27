import { ulid } from 'ulid'
import Store from 'electron-store'

const store = new Store({
  name: 'window-resizer',
})

interface PresetSize {
  id: string
  width: number
  height: number
}

class StoreApi {
  getPresets(): PresetSize[] {
    const value = store.get('presets') as string | undefined
    if (value) {
      return JSON.parse(value)
    }
    return [
      {
        id: ulid(),
        width: 1280,
        height: 800,
      },
    ]
  }

  async setPresets(presets: PresetSize[]) {
    store.set('presets', JSON.stringify(presets))
  }
}

export const storeApi = new StoreApi()
