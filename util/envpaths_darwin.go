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

	library := filepath.Join(homedir, "Library")
	return Paths{
		Data:   filepath.Join(library, "Application Support", name),
		Config: filepath.Join(library, "Preferences", name),
		Cache:  filepath.Join(library, "Caches", name),
		Log:    filepath.Join(library, "Logs", name),
		Temp:   filepath.Join(tmpdir, name),
	}, nil
}
