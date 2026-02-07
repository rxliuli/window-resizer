package main

import (
	"window-resizer/util/ctx"
	"window-resizer/util/permission"
	"window-resizer/util/store"
	"window-resizer/util/tray"
	"window-resizer/util/window"
)

type GreetService struct{}

func (g *GreetService) GetPresets() ([]store.PresetSize, error) {
	storeAPI := store.NewStoreAPI()
	return storeAPI.GetPresets()
}

func (g *GreetService) SetPresets(presets []store.PresetSize) error {
	storeAPI := store.NewStoreAPI()
	err := storeAPI.SetPresets(presets)
	if err != nil {
		return err
	}
	tray.RefreshTrayMenus(ctx.GetApp(), ctx.GetTray())
	return nil
}

func (g *GreetService) CheckPermission() bool {
	return permission.HasAccessibilityPermission()
}

func (g *GreetService) RequestPermission() {
	permission.GrantAccessibilityPermission()
}

func (g *GreetService) ClosePermissionWindow() {
	window.ClosePermissionWindow()
}
