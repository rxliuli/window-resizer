import AppKit
import ApplicationServices
import os.log

enum ResizeError: LocalizedError {
    case noWindowsOnScreen
    case noResizableWindow
    case setSizeFailed

    var errorDescription: String? {
        switch self {
        case .noWindowsOnScreen: return "No windows found on screen"
        case .noResizableWindow: return "No resizable window found"
        case .setSizeFailed: return "Failed to set window size"
        }
    }
}

/// Direct port of the resize logic from the Go version's resize_darwin.go.
enum Resizer {
    private static let log = Logger(subsystem: "com.rxliuli.window-resizer", category: "resize")

    static func resizeFocusedWindow(width: Int, height: Int) throws {
        log.info("Resizing focused window to \(width)x\(height)")
        let myPID = ProcessInfo.processInfo.processIdentifier

        // Strategy 1: AX focused application -> focused window (skip self)
        let systemWide = AXUIElementCreateSystemWide()
        var focusedAppRef: CFTypeRef?
        let err = AXUIElementCopyAttributeValue(
            systemWide, kAXFocusedApplicationAttribute as CFString, &focusedAppRef)
        if err == .success, let focusedAppRef {
            let focusedApp = focusedAppRef as! AXUIElement
            var focusedPID: pid_t = 0
            AXUIElementGetPid(focusedApp, &focusedPID)
            if focusedPID != myPID {
                var windowRef: CFTypeRef?
                if AXUIElementCopyAttributeValue(
                    focusedApp, kAXFocusedWindowAttribute as CFString, &windowRef) == .success,
                    let windowRef,
                    setSize(of: windowRef as! AXUIElement, width: width, height: height) {
                    return
                }
            }
        }

        // Strategy 2: topmost normal window via CGWindowList, then resize via AX
        guard let windowList = CGWindowListCopyWindowInfo(
            [.optionOnScreenOnly, .excludeDesktopElements], kCGNullWindowID) as? [[String: Any]]
        else {
            throw ResizeError.noWindowsOnScreen
        }

        var targetPID: pid_t = 0
        for info in windowList {
            guard (info[kCGWindowLayer as String] as? Int) == 0,
                  let boundsDict = info[kCGWindowBounds as String] as? NSDictionary,
                  let bounds = CGRect(dictionaryRepresentation: boundsDict),
                  bounds.width >= 50, bounds.height >= 50,
                  let ownerPID = info[kCGWindowOwnerPID as String] as? pid_t,
                  ownerPID != myPID
            else { continue }
            targetPID = ownerPID
            break
        }

        guard targetPID != 0 else { throw ResizeError.noResizableWindow }

        let appElement = AXUIElementCreateApplication(targetPID)
        var targetWindow: AXUIElement?

        var focusedWindowRef: CFTypeRef?
        if AXUIElementCopyAttributeValue(
            appElement, kAXFocusedWindowAttribute as CFString, &focusedWindowRef) == .success,
            let focusedWindowRef {
            targetWindow = (focusedWindowRef as! AXUIElement)
        } else {
            var windowsRef: CFArray?
            if AXUIElementCopyAttributeValues(
                appElement, kAXWindowsAttribute as CFString, 0, 100, &windowsRef) == .success,
                let windows = windowsRef as? [AXUIElement], !windows.isEmpty {
                targetWindow = windows[0]
            }
        }

        guard let targetWindow else { throw ResizeError.noResizableWindow }
        guard setSize(of: targetWindow, width: width, height: height) else {
            throw ResizeError.setSizeFailed
        }
    }

    private static func setSize(of window: AXUIElement, width: Int, height: Int) -> Bool {
        var size = CGSize(width: width, height: height)
        guard let value = AXValueCreate(.cgSize, &size) else { return false }
        return AXUIElementSetAttributeValue(window, kAXSizeAttribute as CFString, value) == .success
    }
}
