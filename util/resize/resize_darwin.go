package resize

import (
	"fmt"
	"os/exec"
	"time"
	"window-resizer/util/logger"
)

var ResizeWindowScript = `
tell application "System Events"
    set frontAppProcess to first application process whose frontmost is true
    if exists (window 1 of frontAppProcess) then
        tell frontAppProcess
            repeat with win in windows
                if role of win is "AXWindow" and subrole of win is "AXStandardWindow" then
                    tell win
                        set size to {%d, %d}
                    end tell
                    exit repeat
                end if
            end repeat
        end tell
    else
        error "Frontmost application has no windows to resize." number -1701
    end if
end tell
`

// ResizeWindow resizes the frontmost window to the specified dimensions
func ResizeWindow(width, height int) error {
	script := fmt.Sprintf(ResizeWindowScript, width, height)

	logger.Info("Starting to resize window to %d x %d", width, height)
	start := time.Now()
	// Use -ss flag to get machine-readable output
	cmd := exec.Command("osascript", "-ss", "-e", script)
	output, err := cmd.CombinedOutput()
	if err != nil {
		logger.Error("Failed to resize window: %v, output: %s", err, string(output))
		return fmt.Errorf("failed to resize window: %v, output: %s", err, string(output))
	}
	logger.Info("Successfully resized window to %d x %d, time: %s", width, height, time.Since(start))
	return nil
}
