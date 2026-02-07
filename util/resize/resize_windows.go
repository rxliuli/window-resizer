package resize

import (
	"fmt"
	"time"
	"unsafe"
	"window-resizer/util/logger"

	"golang.org/x/sys/windows"
)

var (
	user32              = windows.NewLazyDLL("user32.dll")
	procGetForegroundWin = user32.NewProc("GetForegroundWindow")
	procGetWindowRect   = user32.NewProc("GetWindowRect")
	procMoveWindow      = user32.NewProc("MoveWindow")
)

type rect struct {
	Left, Top, Right, Bottom int32
}

func ResizeWindow(width, height int) error {
	logger.Info("Starting to resize window to %d x %d", width, height)
	start := time.Now()

	hwnd, _, _ := procGetForegroundWin.Call()
	if hwnd == 0 {
		logger.Error("No foreground window found")
		return fmt.Errorf("no foreground window found")
	}

	var r rect
	ret, _, err := procGetWindowRect.Call(hwnd, uintptr(unsafe.Pointer(&r)))
	if ret == 0 {
		logger.Error("Failed to get window rect: %v", err)
		return fmt.Errorf("failed to get window rect: %v", err)
	}

	ret, _, err = procMoveWindow.Call(
		hwnd,
		uintptr(r.Left),
		uintptr(r.Top),
		uintptr(width),
		uintptr(height),
		1, // repaint
	)
	if ret == 0 {
		logger.Error("Failed to resize window: %v", err)
		return fmt.Errorf("failed to resize window: %v", err)
	}

	logger.Info("Successfully resized window to %d x %d, time: %s", width, height, time.Since(start))
	return nil
}
