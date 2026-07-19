import SwiftUI

struct PreferencesView: View {
    @ObservedObject private var store = PresetStore.shared
    @State private var editingPreset: PresetSize?
    @State private var isAddingPreset = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 4) {
                Text("Window Size Presets")
                    .font(.headline)
                Text("Manage your preset window sizes for quick resizing")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Button {
                isAddingPreset = true
            } label: {
                Label("Add Preset", systemImage: "plus")
            }

            List {
                ForEach(store.presets) { preset in
                    HStack {
                        Text("\(preset.width) × \(preset.height) px")
                        Spacer()
                        Button {
                            editingPreset = preset
                        } label: {
                            Image(systemName: "pencil")
                        }
                        .buttonStyle(.borderless)
                        Button {
                            store.delete(id: preset.id)
                        } label: {
                            Image(systemName: "trash")
                        }
                        .buttonStyle(.borderless)
                    }
                    .padding(.vertical, 2)
                }
            }
            .listStyle(.bordered)
        }
        .padding(20)
        .frame(minWidth: 420, minHeight: 320)
        .sheet(isPresented: $isAddingPreset) {
            PresetEditorView(title: "Add New Preset") { width, height in
                store.add(width: width, height: height)
            }
        }
        .sheet(item: $editingPreset) { preset in
            PresetEditorView(
                title: "Edit Preset",
                initialWidth: String(preset.width),
                initialHeight: String(preset.height)
            ) { width, height in
                store.update(id: preset.id, width: width, height: height)
            }
        }
    }
}

private struct PresetEditorView: View {
    let title: String
    var initialWidth = ""
    var initialHeight = ""
    let onSave: (Int, Int) -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var width = ""
    @State private var height = ""

    private var parsed: (Int, Int)? {
        guard let w = Int(width), let h = Int(height), w > 0, h > 0 else { return nil }
        return (w, h)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(title)
                .font(.headline)
            Form {
                TextField("Width", text: $width)
                TextField("Height", text: $height)
            }
            HStack {
                Spacer()
                Button("Cancel") { dismiss() }
                    .keyboardShortcut(.cancelAction)
                Button("Save") {
                    if let (w, h) = parsed {
                        onSave(w, h)
                        dismiss()
                    }
                }
                .keyboardShortcut(.defaultAction)
                .disabled(parsed == nil)
            }
        }
        .padding(20)
        .frame(width: 300)
        .onAppear {
            width = initialWidth
            height = initialHeight
        }
    }
}
