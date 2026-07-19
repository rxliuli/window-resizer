import AppKit
import SwiftUI

final class WindowManager: NSObject, NSWindowDelegate {
    static let shared = WindowManager()

    private var preferencesWindow: NSWindow?
    private var permissionWindow: NSWindow?

    func openPreferencesWindow() {
        if preferencesWindow == nil {
            preferencesWindow = makeWindow(rootView: PreferencesView(), size: NSSize(width: 480, height: 400))
        }
        show(preferencesWindow)
    }

    /// Mirrors the old behavior: if the preferences window is open, preset
    /// clicks resize it instead of the focused window (handy for previewing).
    func resizePreferencesWindowIfOpen(width: Int, height: Int) -> Bool {
        guard let window = preferencesWindow else { return false }
        window.setContentSize(NSSize(width: width, height: height))
        return true
    }

    func openPermissionWindow() {
        if permissionWindow == nil {
            permissionWindow = makeWindow(rootView: PermissionView(), size: NSSize(width: 420, height: 280))
        }
        show(permissionWindow)
    }

    func closePermissionWindow() {
        permissionWindow?.close()
    }

    private func makeWindow(rootView: some View, size: NSSize) -> NSWindow {
        let window = NSWindow(
            contentRect: NSRect(origin: .zero, size: size),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = "Window Resizer"
        window.contentViewController = NSHostingController(rootView: rootView)
        window.setContentSize(size)
        window.center()
        window.isReleasedWhenClosed = false
        window.delegate = self
        return window
    }

    private func show(_ window: NSWindow?) {
        NSApp.activate(ignoringOtherApps: true)
        window?.makeKeyAndOrderFront(nil)
    }

    func windowWillClose(_ notification: Notification) {
        guard let window = notification.object as? NSWindow else { return }
        if window === preferencesWindow { preferencesWindow = nil }
        if window === permissionWindow { permissionWindow = nil }
    }
}
