// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "WindowResizer",
    platforms: [.macOS(.v13)],
    targets: [
        .executableTarget(
            name: "WindowResizer",
            path: "Sources/WindowResizer"
        )
    ]
)
