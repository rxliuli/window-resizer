import { runAppleScript } from 'run-applescript'

const TriggerPermissionScript = `
tell application "System Events"
    try
        set frontAppProcess to first application process whose frontmost is true
        if exists (window 1 of frontAppProcess) then
            return true
        else
            return false
        end if
    on error
        return false
    end try
end tell
`

export async function triggerPermissionDialog() {
  await runAppleScript(TriggerPermissionScript)
}

const ResizeWindowScript = `
tell application "System Events"
    set frontAppProcess to first application process whose frontmost is true
    if exists (window 1 of frontAppProcess) then
        tell frontAppProcess
            tell front window
                set size to {{{width}}, {{height}}}
                -- Optional: set position to {{1280, 800}}
            end tell
        end tell
    else
        error "Frontmost application has no windows to resize." number -1701
    end if
end tell
`.trim()

export async function resizeWindow(width: number, height: number) {
  await runAppleScript(
    ResizeWindowScript.replace('{{width}}', width.toString()).replace('{{height}}', height.toString()),
  )
}
