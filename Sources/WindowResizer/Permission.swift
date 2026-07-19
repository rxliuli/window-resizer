import ApplicationServices

enum Permission {
    static var hasAccessibility: Bool {
        AXIsProcessTrusted()
    }

    /// Prompts the system Accessibility permission dialog / opens System Settings.
    static func requestAccessibility() {
        let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true]
        AXIsProcessTrustedWithOptions(options as CFDictionary)
    }
}
