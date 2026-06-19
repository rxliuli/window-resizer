package resize

// #cgo CFLAGS: -x objective-c
// #cgo LDFLAGS: -framework Cocoa -framework ApplicationServices
// #import <Cocoa/Cocoa.h>
// #import <ApplicationServices/ApplicationServices.h>
//
// static int setWindowSize(AXUIElementRef window, int width, int height) {
//     CGSize newSize = CGSizeMake(width, height);
//     AXValueRef sizeValue = AXValueCreate(kAXValueTypeCGSize, &newSize);
//     if (sizeValue == NULL) return -3;
//     AXError err = AXUIElementSetAttributeValue(window, kAXSizeAttribute, sizeValue);
//     CFRelease(sizeValue);
//     return (err == kAXErrorSuccess) ? 0 : -3;
// }
//
// int resizeFocusedWindow(int width, int height) {
//     pid_t myPID = [[NSProcessInfo processInfo] processIdentifier];
//
//     // Strategy 1: AX focused application -> focused window (skip self)
//     AXUIElementRef sysWide = AXUIElementCreateSystemWide();
//     AXUIElementRef focusedApp = NULL;
//     AXError err = AXUIElementCopyAttributeValue(
//         sysWide, kAXFocusedApplicationAttribute, (CFTypeRef *)&focusedApp);
//     CFRelease(sysWide);
//
//     if (err == kAXErrorSuccess && focusedApp != NULL) {
//         pid_t focusedPID = 0;
//         AXUIElementGetPid(focusedApp, &focusedPID);
//         if (focusedPID != myPID) {
//             AXUIElementRef focusedWindow = NULL;
//             err = AXUIElementCopyAttributeValue(
//                 focusedApp, kAXFocusedWindowAttribute, (CFTypeRef *)&focusedWindow);
//             CFRelease(focusedApp);
//             if (err == kAXErrorSuccess && focusedWindow != NULL) {
//                 int result = setWindowSize(focusedWindow, width, height);
//                 CFRelease(focusedWindow);
//                 if (result == 0) return 0;
//             }
//         } else {
//             CFRelease(focusedApp);
//         }
//     } else if (focusedApp != NULL) {
//         CFRelease(focusedApp);
//     }
//
//     // Strategy 2: find the topmost normal window via CGWindowList, then resize via AX
//     CFArrayRef windowList = CGWindowListCopyWindowInfo(
//         kCGWindowListOptionOnScreenOnly | kCGWindowListExcludeDesktopElements,
//         kCGNullWindowID);
//     if (windowList == NULL) return -1;
//
//     pid_t targetPID = 0;
//     for (CFIndex i = 0; i < CFArrayGetCount(windowList); i++) {
//         NSDictionary *info = (__bridge NSDictionary *)CFArrayGetValueAtIndex(windowList, i);
//
//         int layer = [info[(__bridge NSString *)kCGWindowLayer] intValue];
//         if (layer != 0) continue;
//
//         NSDictionary *boundsDict = info[(__bridge NSString *)kCGWindowBounds];
//         if (boundsDict == nil) continue;
//         CGRect bounds;
//         if (!CGRectMakeWithDictionaryRepresentation((__bridge CFDictionaryRef)boundsDict, &bounds))
//             continue;
//         if (bounds.size.width < 50 || bounds.size.height < 50) continue;
//
//         NSNumber *pidNum = info[(__bridge NSString *)kCGWindowOwnerPID];
//         if (pidNum == nil) continue;
//         pid_t pid = [pidNum intValue];
//         if (pid == myPID) continue;
//         targetPID = pid;
//         break;
//     }
//     CFRelease(windowList);
//
//     if (targetPID == 0) return -2;
//
//     AXUIElementRef appRef = AXUIElementCreateApplication(targetPID);
//     AXUIElementRef targetWindow = NULL;
//
//     err = AXUIElementCopyAttributeValue(
//         appRef, kAXFocusedWindowAttribute, (CFTypeRef *)&targetWindow);
//
//     if (err != kAXErrorSuccess || targetWindow == NULL) {
//         CFArrayRef axWindows = NULL;
//         err = AXUIElementCopyAttributeValues(
//             appRef, kAXWindowsAttribute, 0, 100, &axWindows);
//         if (err == kAXErrorSuccess && axWindows != NULL && CFArrayGetCount(axWindows) > 0) {
//             targetWindow = (AXUIElementRef)CFRetain(CFArrayGetValueAtIndex(axWindows, 0));
//         }
//         if (axWindows != NULL) CFRelease(axWindows);
//     }
//     CFRelease(appRef);
//
//     if (targetWindow == NULL) return -2;
//
//     int result = setWindowSize(targetWindow, width, height);
//     CFRelease(targetWindow);
//     return result;
// }
import "C"

import (
	"fmt"
	"time"
	"window-resizer/util/logger"
)

func ResizeWindow(width, height int) error {
	logger.Info("Starting to resize window to %d x %d", width, height)
	start := time.Now()

	ret := C.resizeFocusedWindow(C.int(width), C.int(height))
	switch ret {
	case 0:
		logger.Info("Successfully resized window to %d x %d, time: %s", width, height, time.Since(start))
		return nil
	case -1:
		logger.Error("No windows found on screen")
		return fmt.Errorf("no windows found on screen")
	case -2:
		logger.Error("No resizable window found")
		return fmt.Errorf("no resizable window found")
	case -3:
		logger.Error("Failed to set window size")
		return fmt.Errorf("failed to set window size")
	default:
		logger.Error("Unknown error resizing window: %d", ret)
		return fmt.Errorf("unknown error resizing window: %d", ret)
	}
}
