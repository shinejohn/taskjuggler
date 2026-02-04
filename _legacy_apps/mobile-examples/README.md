# Mobile App Example Code

This directory contains example implementations for both Android and iOS native applications.

## Structure

```
mobile-examples/
├── android/
│   ├── AuthActivity.kt          # Login/Register screen
│   ├── TasksScreen.kt            # Tasks list screen
│   └── README.md                 # Android-specific notes
├── ios/
│   ├── AuthView.swift            # Login/Register screen
│   ├── TasksView.swift           # Tasks list screen
│   ├── TasksViewModel.swift      # Tasks view model
│   ├── AuthViewModel.swift       # Auth view model
│   └── README.md                 # iOS-specific notes
└── README.md                     # This file
```

## Android Examples

### Prerequisites
- Android Studio Arctic Fox or later
- Kotlin 1.7+
- Android SDK 24+ (Android 7.0+)
- Jetpack Compose

### Setup
1. Create a new Android project with Compose
2. Add dependencies from `MOBILE_API_INTEGRATION_GUIDE.md`
3. Copy the example files to your project
4. Configure API base URL in `ApiClient.kt`

### Key Files
- **AuthActivity.kt**: Complete authentication screen with login/register
- **TasksScreen.kt**: Tasks list with filtering, search, and swipe actions

## iOS Examples

### Prerequisites
- Xcode 14+
- iOS 15+
- Swift 5.7+

### Setup
1. Create a new iOS project
2. Add dependencies (Alamofire, KeychainAccess)
3. Copy the example files to your project
4. Configure API base URL in `ApiService.swift`

### Key Files
- **AuthView.swift**: Complete authentication screen
- **TasksView.swift**: Tasks list with SwiftUI
- **TasksViewModel.swift**: ViewModel with async/await
- **AuthViewModel.swift**: Authentication view model

## Usage

### Android
```kotlin
// In your MainActivity or Navigation setup
setContent {
    TaskJugglerTheme {
        if (isAuthenticated) {
            TasksScreen(
                onTaskClick = { taskId ->
                    // Navigate to task detail
                },
                onCreateTaskClick = {
                    // Navigate to create task
                }
            )
        } else {
            AuthScreen()
        }
    }
}
```

### iOS
```swift
// In your App.swift or SceneDelegate
@main
struct TaskJugglerApp: App {
    @StateObject private var authViewModel = AuthViewModel()
    
    var body: some Scene {
        WindowGroup {
            if authViewModel.isAuthenticated {
                TasksView()
            } else {
                AuthView()
            }
        }
    }
}
```

## Integration Steps

1. **Copy API Client Code**
   - Android: Copy `ApiClient.kt`, `ApiService.kt`, `TokenManager.kt` from guide
   - iOS: Copy `ApiService.swift`, `TokenManager.swift` from guide

2. **Copy Data Models**
   - Copy model classes for Task, User, InboxItem, etc.

3. **Implement ViewModels**
   - Android: Use ViewModel with StateFlow/Flow
   - iOS: Use ObservableObject with @Published

4. **Create UI Screens**
   - Use provided examples as starting point
   - Customize to match your design system

5. **Add Navigation**
   - Android: Use Navigation Component
   - iOS: Use NavigationView/NavigationStack

6. **Test API Integration**
   - Test all endpoints
   - Test error handling
   - Test offline scenarios

## Next Steps

1. Implement remaining screens (Inbox, Messages, Teams, Marketplace)
2. Add push notifications
3. Add offline support
4. Add analytics
5. Add deep linking
6. Test on physical devices

## Notes

- These are example implementations - customize as needed
- Follow platform-specific design guidelines
- Ensure proper error handling
- Test thoroughly before production release
