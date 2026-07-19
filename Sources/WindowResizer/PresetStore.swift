import Foundation
import os.log

struct PresetSize: Codable, Identifiable, Equatable {
    var id: String
    var width: Int
    var height: Int
}

/// Reads and writes the same config file as the previous Go/Wails version
/// (~/Library/Preferences/window-resizer/window-resizer.json), so existing
/// presets carry over. Unknown top-level keys in the file are preserved.
final class PresetStore: ObservableObject {
    static let shared = PresetStore()

    @Published private(set) var presets: [PresetSize]

    private let fileURL: URL
    private var raw: [String: Any]
    private let log = Logger(subsystem: "com.wails.window-resizer", category: "store")

    private init() {
        let configDir = FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent("Library/Preferences/window-resizer", isDirectory: true)
        fileURL = configDir.appendingPathComponent("window-resizer.json")
        try? FileManager.default.createDirectory(at: configDir, withIntermediateDirectories: true)

        raw = (try? Data(contentsOf: fileURL))
            .flatMap { try? JSONSerialization.jsonObject(with: $0) as? [String: Any] } ?? [:]

        if let stored = raw["presets"],
           let data = try? JSONSerialization.data(withJSONObject: stored),
           let decoded = try? JSONDecoder().decode([PresetSize].self, from: data) {
            presets = decoded
        } else {
            // Same default the Go version returned when no presets were stored.
            presets = [PresetSize(id: ULID.generate(), width: 1280, height: 800)]
        }
    }

    func add(width: Int, height: Int) {
        presets.append(PresetSize(id: ULID.generate(), width: width, height: height))
        persist()
    }

    func update(id: String, width: Int, height: Int) {
        guard let index = presets.firstIndex(where: { $0.id == id }) else { return }
        presets[index].width = width
        presets[index].height = height
        persist()
    }

    func delete(id: String) {
        presets.removeAll { $0.id == id }
        persist()
    }

    private func persist() {
        do {
            let encoded = try JSONEncoder().encode(presets)
            raw["presets"] = try JSONSerialization.jsonObject(with: encoded)
            let data = try JSONSerialization.data(
                withJSONObject: raw, options: [.prettyPrinted, .sortedKeys])
            try data.write(to: fileURL, options: .atomic)
        } catch {
            log.error("Failed to persist presets: \(error)")
        }
    }
}
