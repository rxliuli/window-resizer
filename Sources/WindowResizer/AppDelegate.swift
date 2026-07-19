import AppKit
import os.log

final class AppDelegate: NSObject, NSApplicationDelegate, NSMenuDelegate {
    private var statusItem: NSStatusItem!
    private let log = Logger(subsystem: "com.rxliuli.window-resizer", category: "app")

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory)

        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        statusItem.button?.image = trayIcon()

        let menu = NSMenu()
        menu.delegate = self
        statusItem.menu = menu

        if !Permission.hasAccessibility {
            WindowManager.shared.openPermissionWindow()
        }

        log.info("Application started")
    }

    // Rebuilt every time the menu opens, so preset changes are always reflected.
    func menuNeedsUpdate(_ menu: NSMenu) {
        menu.removeAllItems()

        for preset in PresetStore.shared.presets {
            let item = NSMenuItem(
                title: "Resize to \(preset.width)x\(preset.height)",
                action: #selector(resizeAction(_:)),
                keyEquivalent: ""
            )
            item.target = self
            item.representedObject = preset
            menu.addItem(item)
        }

        menu.addItem(.separator())

        let preferences = NSMenuItem(
            title: "Preferences", action: #selector(openPreferences), keyEquivalent: ",")
        preferences.target = self
        menu.addItem(preferences)

        let quit = NSMenuItem(
            title: "Quit", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        menu.addItem(quit)
    }

    @objc private func resizeAction(_ sender: NSMenuItem) {
        guard let preset = sender.representedObject as? PresetSize else { return }
        if WindowManager.shared.resizePreferencesWindowIfOpen(width: preset.width, height: preset.height) {
            return
        }
        do {
            try Resizer.resizeFocusedWindow(width: preset.width, height: preset.height)
        } catch {
            log.error("Failed to resize window: \(error.localizedDescription)")
        }
    }

    @objc private func openPreferences() {
        WindowManager.shared.openPreferencesWindow()
    }

    private func trayIcon() -> NSImage? {
        if let url = Bundle.main.url(forResource: "tray-icon", withExtension: "png"),
           let image = NSImage(contentsOf: url) {
            image.isTemplate = true
            image.size = NSSize(width: 18, height: 18)
            return image
        }
        // Fallback for `swift run` during development, where there is no app bundle.
        return NSImage(systemSymbolName: "macwindow", accessibilityDescription: "Window Resizer")
    }
}
