package permission

// HasAccessibilityPermission on Windows always returns true
// because Win32 API does not require special permissions to resize windows.
func HasAccessibilityPermission() bool {
	return true
}

// GrantAccessibilityPermission is a no-op on Windows.
func GrantAccessibilityPermission() {
}
