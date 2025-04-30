package util

import (
	"os"
	"path/filepath"
)

// https://github.com/sindresorhus/env-paths/blob/main/index.js
func EnvPaths(name string) (Paths, error) {
	homedir, err := os.UserHomeDir()
	if err != nil {
		return Paths{}, err
	}
	tmpdir := os.TempDir()

	appData := os.Getenv("APPDATA")
	if appData == "" {
		appData = filepath.Join(homedir, "AppData", "Roaming")
	}
	localAppData := os.Getenv("LOCALAPPDATA")
	if localAppData == "" {
		localAppData = filepath.Join(homedir, "AppData", "Local")
	}

	return Paths{
		Data:   filepath.Join(localAppData, name, "Data"),
		Config: filepath.Join(appData, name, "Config"),
		Cache:  filepath.Join(localAppData, name, "Cache"),
		Log:    filepath.Join(localAppData, name, "Log"),
		Temp:   filepath.Join(tmpdir, name),
	}, nil
}
