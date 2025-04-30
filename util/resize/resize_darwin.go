package resize

import (
	"fmt"
	"os/exec"
)

var ResizeWindowScript = `
tell application "System Events"
    set frontAppProcess to first application process whose frontmost is true
    if exists (window 1 of frontAppProcess) then
        tell frontAppProcess
            tell front window
                set size to {%d, %d}
            end tell
        end tell
    else
        error "Frontmost application has no windows to resize." number -1701
    end if
end tell
`

// ResizeWindow resizes the frontmost window to the specified dimensions
func ResizeWindow(width, height int) error {
	script := fmt.Sprintf(ResizeWindowScript, width, height)

	// Use -ss flag to get machine-readable output
	cmd := exec.Command("osascript", "-ss", "-e", script)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to resize window: %v, output: %s", err, string(output))
	}
	return nil
}
