# 3D Secure v2 Browser Demo

A comprehensive browser-based demonstration of 3D Secure v2 authentication flows with support for all test scenarios defined in the official sandbox documentation.

## Features

- **30+ Pre-configured Test Cards**: Comprehensive dropdown with test cards for all authentication scenarios
- **Dynamic Version Detection**: Automatically selects the highest supported version based on ACS capabilities
- **All Authentication Flows**: Supports frictionless, challenge, and 3DS Method flows
- **Visual Status Indicators**: Clear visual feedback for each step of the authentication process
- **Real-time API Response Logging**: See all API requests and responses as they happen
- **Pattern-based Test Card System**: Understand how the last 4 digits determine test behavior
- **Custom PAN Entry**: Test additional card numbers beyond the pre-configured ones

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the proxy server:
```bash
npm start
```

3. Open http://localhost:3002 in your browser

## How it Works

1. **Proxy Server** (`proxy-server.js`):
   - Runs on port 3002 (or PORT env variable)
   - Handles CORS by proxying API calls to the 3DS sandbox
   - Serves the HTML demo page
   - Logs all requests and responses

2. **HTML Demo** (`index.html`):
   - Shows step-by-step authentication flow
   - Handles 3DS Method in hidden iframe
   - Displays challenge in visible iframe
   - Shows all API responses

## Test Cards

The demo includes a comprehensive dropdown with 30+ test cards organized by scenario:

### Test Categories
- **Enrollment Tests**: Cards not enrolled for 3D Secure
- **Frictionless Success (Y)**: Various version and 3DS Method combinations
- **Frictionless Failure (N)**: Different failure scenarios
- **Frictionless Other Outcomes**: Attempted (A), Rejected (R), Information (I), Unable (U), DS timeout
- **Challenge Auto-Pass**: Challenges that complete automatically with success
- **Challenge Auto-Fail**: Challenges that complete automatically with failure
- **Challenge Manual**: Challenges requiring user interaction

### Understanding Test Card Patterns
The last 4 digits of test cards determine their behavior:
- **1st digit**: Message version (0=all versions, 1=v2.1 only, 2=v2.2 only, 3=v2.3 only)
- **2nd digit**: 3DS Method (0=included, 1=not included, 2=timeout)
- **3rd digit**: ARes outcome (0-5=frictionless outcomes, 6=DS timeout, 7=challenge required)
- **4th digit**: Challenge behavior when 3rd=7 (0=auto-pass, 1=auto-fail, 2=manual)

## Authentication Flow

1. **Pre-Authentication**: 
   - Checks if card is enrolled for 3D Secure
   - Determines supported message versions
   - Provides 3DS Method URL if available

2. **3DS Method** (if available):
   - Browser fingerprinting via hidden iframe
   - 10-second timeout handling
   - Completion indicator (Y/N) sent with auth request

3. **Authentication Request**:
   - Automatically uses highest supported version
   - Handles various outcomes (Y/N/A/R/I/U/C)
   - Visual indicators for each status type

4. **Challenge Flow** (if required):
   - Displayed in visible iframe
   - Supports auto-complete and manual challenges
   - Real-time status monitoring

5. **Post-Authentication**: 
   - Retrieves final authentication result
   - Displays ECI and authentication value

## API Endpoints

All API calls go through the proxy:
- `/api/3ds/preauth` → `https://service.sandbox.3dsecure.io/preauth`
- `/api/3ds/auth` → `https://service.sandbox.3dsecure.io/auth`
- `/api/3ds/postauth` → `https://service.sandbox.3dsecure.io/postauth`

## Callback URLs

The demo uses `http://echo.localhost` for callbacks:
- 3DS Method: `http://echo.localhost/3ds-method-notification`
- Challenge: `http://echo.localhost/notification`

## Key Improvements

### Dynamic Version Selection
The demo automatically detects which message versions the ACS supports and selects the appropriate version based on:
- ACS protocol versions from pre-auth response
- Test card requirements (determined by first digit of last 4)
- Intersection of both to ensure compatibility

### Enhanced Error Handling
- Not enrolled cards show clear status without continuing flow
- Invalid version errors display helpful messages
- DS timeout scenarios handled gracefully
- 3DS Method timeout properly sets completion indicator to "N"

### Visual Feedback
- ✅ Success (frictionless or challenge)
- ❌ Failure or not enrolled
- ⚠️ Attempted authentication
- 🚫 Rejected
- ℹ️ Information only (v2.2+)
- ❓ Unable to authenticate
- Step-by-step progress indicators
- Color-coded status messages

### Test Scenario Coverage
The dropdown includes test cards for:
- All frictionless outcomes (Y, N, A, R, I, U)
- DS timeout scenarios
- Challenge flows (auto-pass, auto-fail, manual)
- Version-specific tests (2.1, 2.2, 2.3)
- 3DS Method variations (included, not included, timeout)
- Enrollment status testing

## Development

For development with auto-reload:
```bash
npm run dev
```

## Notes

- The sandbox API key is hardcoded for demo purposes
- Only specific test PANs are configured in the sandbox
- The documented examples (marked with ✓) are guaranteed to work
- Custom PANs must follow the pattern rules to be valid