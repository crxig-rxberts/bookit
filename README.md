# Bookit Mobile Application

This React Native application serves as the frontend for the Bookit platform, which integrates with six backend APIs to provide booking services. The app is designed to run on both Android and iOS devices.

## Prerequisites

- Node.js (>=18) installed.
- Android Studio for running the Android emulator - https://developer.android.com/studio.
- React Native CLI (`react-native`).

## APIs Dependency

This application depends on six backend services for full functionality:

1. **Booking Service**: Manages the creation, updating, and deletion of bookings - https://github.com/crxig-rxberts/booking-service.
2. **Client Service**: Handles client data - https://github.com/crxig-rxberts/client-service.
3. **Provider Service**: Manages service providers and their availability - https://github.com/crxig-rxberts/provider-service.
4. **Search Service**: Provides search capabilities for finding service providers and available timeslots - https://github.com/crxig-rxberts/search-service.
5. **Timeslot Service**: Manages the availability of timeslots for each service provider - https://github.com/crxig-rxberts/timeslot-service.
6. **User Service**: Manages user authentication and registration via AWS Cognito - https://github.com/crxig-rxberts/user-service.

Each of these services must be running for the app to operate correctly. Ensure all APIs are properly configured and deployed before using the app.


