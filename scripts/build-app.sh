#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

APP_NAME="WindowResizer"
BIN_DIR="bin"
APP_PATH="${BIN_DIR}/${APP_NAME}.app"

# Universal binary by default; pass --native for a quick single-arch build.
if [[ "${1:-}" == "--native" ]]; then
    swift build -c release
    BINARY=".build/release/${APP_NAME}"
else
    swift build -c release --arch arm64 --arch x86_64
    BINARY=".build/apple/Products/Release/${APP_NAME}"
fi

rm -rf "${APP_PATH}"
mkdir -p "${APP_PATH}/Contents/MacOS" "${APP_PATH}/Contents/Resources"
cp "${BINARY}" "${APP_PATH}/Contents/MacOS/"
cp Resources/Info.plist "${APP_PATH}/Contents/"
cp Resources/icons.icns "${APP_PATH}/Contents/Resources/"
cp Resources/tray-icon.png "${APP_PATH}/Contents/Resources/"

echo "Built ${APP_PATH}"
