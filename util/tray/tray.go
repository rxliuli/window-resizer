package tray

import (
	"embed"
	"fmt"

	"window-resizer/util/resize"
	"window-resizer/util/store"
	"window-resizer/util/window"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed assets/tray-icon.png
var trayIcon embed.FS

var tray *application.SystemTray
var menu *application.Menu

func CreateTray(app *application.App) *application.SystemTray {
	tray = app.SystemTray.New()
	iconBytes, _ := trayIcon.ReadFile("assets/tray-icon.png")
	tray.SetTemplateIcon(iconBytes)

	menu = app.NewMenu()
	buildMenuItems(app, menu)
	tray.SetMenu(menu)
	return tray
}

func RefreshTrayMenus(app *application.App, tray *application.SystemTray) {
	// Workaround for Wails v3 bug: SetMenu on macOS only updates the internal
	// reference without refreshing the native NSMenu. Instead of creating a new
	// menu, we reuse the same menu object and call Update() so the existing
	// native menu pointer stays valid and gets rebuilt.
	menu.Clear()
	buildMenuItems(app, menu)
	menu.Update()
}

func buildMenuItems(app *application.App, menu *application.Menu) {
	storeAPI := store.NewStoreAPI()
	presets, err := storeAPI.GetPresets()
	if err != nil {
		fmt.Println("Error getting presets:", err)
	}
	fmt.Println("Presets:", presets)
	for _, preset := range presets {
		menu.Add(fmt.Sprintf("Resize to %dx%d", preset.Width, preset.Height)).OnClick(func(ctx *application.Context) {
			fmt.Printf("Resize to %dx%d\n", preset.Width, preset.Height)
			err := resize.ResizeWindow(preset.Width, preset.Height)
			if err != nil {
				fmt.Println("Error resizing window:", err)
			}
		})
	}
	menu.AddSeparator()
	menu.Add("Preferences").SetAccelerator("CmdOrCtrl+,").OnClick(func(ctx *application.Context) {
		window.OpenPreferencesWindow(app)
	})
	menu.Add("Quit").SetAccelerator("CmdOrCtrl+Q").OnClick(func(ctx *application.Context) {
		app.Quit()
	})
}
