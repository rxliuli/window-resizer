package ctx

import (
	"os"

	"github.com/wailsapp/wails/v3/pkg/application"
)

var (
	app  *application.App
	tray *application.SystemTray
)

// Init initializes the context
func Init(a *application.App, t *application.SystemTray) {
	app = a
	tray = t
}

// IsDevMode returns true if the app is running in development mode
func IsDevMode() bool {
	return os.Getenv("WAILS_VITE_PORT") != ""
}

// GetApp returns the application instance
func GetApp() *application.App {
	return app
}

// GetTray returns the tray instance
func GetTray() *application.SystemTray {
	return tray
}
