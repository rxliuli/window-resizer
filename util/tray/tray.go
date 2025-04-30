package tray

import (
	"embed"
	"fmt"

	"window-resizer/util/ctx"
	"window-resizer/util/resize"
	"window-resizer/util/store"
	"window-resizer/util/window"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed assets/tray-icon.png
var trayIcon embed.FS

var tray *application.SystemTray

func CreateTray(app *application.App) *application.SystemTray {
	tray = app.NewSystemTray()
	iconBytes, _ := trayIcon.ReadFile("assets/tray-icon.png")
	tray.SetTemplateIcon(iconBytes)

	menu := application.NewMenu()
	RefreshTrayMenus(app, menu)
	ctx.SetTrayMenu(menu)
	tray.SetMenu(menu)
	return tray
}

func RefreshTrayMenus(app *application.App, menu *application.Menu) {
	menu.Clear()
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

	menu.Update()
	tray.SetMenu(menu)
}
