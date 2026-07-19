import SwiftUI

struct PermissionView: View {
    @State private var granted = false
    private let timer = Timer.publish(every: 0.5, on: .main, in: .common).autoconnect()

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 4) {
                Text("Accessibility Permission Required")
                    .font(.headline)
                Text("To adjust window sizes, we need access to your system's accessibility features")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            VStack(alignment: .leading, spacing: 8) {
                Text("1. Open System Settings")
                Text("2. Navigate to Privacy & Security > Accessibility")
                Text("3. Toggle the switch to grant WindowResizer accessibility permission")
            }
            .font(.callout)

            if granted {
                Label("Accessibility permission granted", systemImage: "checkmark.circle.fill")
                    .foregroundStyle(.green)
                    .frame(maxWidth: .infinity)
            } else {
                Button {
                    Permission.requestAccessibility()
                } label: {
                    Label("Open System Settings", systemImage: "gearshape")
                        .frame(maxWidth: .infinity)
                }
                .controlSize(.large)
            }
        }
        .padding(20)
        .frame(width: 420)
        .onReceive(timer) { _ in
            guard !granted else { return }
            if Permission.hasAccessibility {
                granted = true
                DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                    WindowManager.shared.closePermissionWindow()
                }
            }
        }
    }
}
