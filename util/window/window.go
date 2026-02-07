package window

import (
	"fmt"

	"github.com/wailsapp/wails/v3/pkg/application"
	"github.com/wailsapp/wails/v3/pkg/events"
)

var preferencesWindow *application.WebviewWindow

// OpenPreferencesWindow opens the preferences window if it's not already open
func OpenPreferencesWindow(app *application.App) {
	if preferencesWindow != nil {
		fmt.Println("Window exists, showing and focusing")
		preferencesWindow.Show()
		preferencesWindow.Focus()
		return
	}

	fmt.Println("Creating new window")
	preferencesWindow = app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title: "Window Resizer",
		URL:   "/",
	})

	preferencesWindow.Show()
	preferencesWindow.Focus()

	// Set up window close handler
	preferencesWindow.OnWindowEvent(events.Common.WindowClosing, func(event *application.WindowEvent) {
		fmt.Println("Window closing")
		preferencesWindow = nil
	})
}

var permissionWindow *application.WebviewWindow

func OpenPermissionWindow(app *application.App) {
	if permissionWindow != nil {
		permissionWindow.Show()
		permissionWindow.Focus()
		return
	}

	permissionWindow = app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title: "Window Resizer",
		URL:   "/#/permission",
	})

	permissionWindow.Show()
	permissionWindow.Focus()

	permissionWindow.OnWindowEvent(events.Common.WindowClosing, func(event *application.WindowEvent) {
		permissionWindow = nil
	})
}

func ClosePermissionWindow() {
	// TODO wails bug
	if permissionWindow != nil {
		permissionWindow.Close()
		permissionWindow = nil
	}
}
