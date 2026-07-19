# WindowResizer

A native macOS menu bar utility to quickly resize the active window to your predefined dimensions.

![WindowResizer Preferences](./docs/preferences.jpg)
_Manage your custom window size presets easily._

## ✨ Features

- **Native & Lightweight:** Built with Swift, AppKit, and SwiftUI — no web runtime, tiny memory footprint.
- **Menu Bar Access:** Lives in your menu bar for easy access.
- **Active Window Resizing:** Instantly resizes the _currently active_ window.
- **Custom Presets:** Define your own preferred window dimensions (width x height).
- **Simple Management:** Add, edit, and delete presets through an intuitive preferences window.

> Looking for the Windows version? The last cross-platform release is
> [v0.2.6](https://github.com/rxliuli/window-resizer/releases/tag/v0.2.6),
> built with the previous Go/Wails codebase.

## 🚀 Installation

### Homebrew

```bash
brew install --cask rxliuli/tap/window-resizer
```

### Manual

1. Go to the [**Releases page**](https://github.com/rxliuli/window-resizer/releases).
2. Download the latest `.dmg`, open it, and drag `WindowResizer.app` to your `/Applications` folder.

Either way, grant Accessibility permission when prompted — it is required to resize other apps' windows.

Requires macOS 13 or later.

## ⚙️ How to Use

1. **Launch the Application:** Start `WindowResizer`. Its icon will appear in your menu bar.
2. **Resize a Window:**
   - Make sure the window you want to resize is the _active_ (frontmost) window.
   - Click the application icon in the menu bar.
   - Select one of your predefined "Resize to WxH" options (e.g., "Resize to 1280x800").
   - The active window will instantly snap to that size.
3. **Manage Presets:**
   - Click the application icon in the menu bar.
   - Select "Preferences".
   - In the "Window Size Presets" window:
     - Click **+ Add Preset** to create a new size definition. Enter the desired Width and Height (in pixels) and save.
     - Click the **pencil icon (✎)** next to a preset to edit its dimensions.
     - Click the **trash can icon (🗑️)** next to a preset to delete it.
   - Changes are reflected immediately in the menu bar list.
4. **Quit:**
   - Click the application icon in the menu bar.
   - Select "Quit".

## 🛠️ Development

```bash
# Run in development
swift run

# Build the app bundle (universal binary)
./scripts/build-app.sh

# Build, sign, notarize, and create the DMG
./build-dmg.sh
```

## 🤝 Contributing

Contributions are welcome! If you have suggestions or find bugs, please open an issue on the [GitHub Issues page](https://github.com/rxliuli/window-resizer/issues). If you'd like to contribute code, please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the [GPL-3.0 License](./LICENSE).
