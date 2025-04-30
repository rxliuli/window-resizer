package util

import (
	"testing"
)

func TestEnvPaths(t *testing.T) {
	paths, err := EnvPaths("window-resizer")
	if err != nil {
		t.Fatal(err)
		return
	}
	t.Log(paths.Config)
}
