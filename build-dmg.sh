#!/usr/bin/env bash

APP_NAME="WindowResizer"
BIN_DIR="bin"
DMG_FILE_NAME="${BIN_DIR}/${APP_NAME}-Installer.dmg"
VOLUME_NAME="${APP_NAME} Installer"
APP_PATH="${BIN_DIR}/${APP_NAME}.app"

# Since create-dmg does not clobber, be sure to delete previous DMG
[[ -f "${DMG_FILE_NAME}" ]] && rm "${DMG_FILE_NAME}"

# Create the DMG with signing and notarization
echo "Creating and signing DMG..."
/opt/homebrew/bin/create-dmg \
  --volname "${VOLUME_NAME}" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "${APP_NAME}.app" 200 190 \
  --hide-extension "${APP_NAME}.app" \
  --app-drop-link 600 185 \
  --codesign "Developer ID Application: KAI WANG (N2X78TUUFG)" \
  --notarize "WindowResizer" \
  "${DMG_FILE_NAME}" \
  "${APP_PATH}"

echo "Build completed successfully!"