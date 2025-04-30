package permission

// #cgo CFLAGS: -x objective-c
// #cgo LDFLAGS: -framework Cocoa
// #import <Cocoa/Cocoa.h>
// #import <Foundation/Foundation.h>
//
// bool hasAccessibilityPermission() {
//     NSDictionary *options = @{(__bridge NSString *)kAXTrustedCheckOptionPrompt: @NO};
//     return AXIsProcessTrustedWithOptions((__bridge CFDictionaryRef)options);
// }
//
// void openAccessibilityPreferences() {
//     NSDictionary *options = @{(__bridge NSString *)kAXTrustedCheckOptionPrompt: @YES};
//     AXIsProcessTrustedWithOptions((__bridge CFDictionaryRef)options);
// }
import "C"

func HasAccessibilityPermission() bool {
	return bool(C.hasAccessibilityPermission())
}

func GrantAccessibilityPermission() {
	C.openAccessibilityPreferences()
}
