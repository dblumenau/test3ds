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
- **Interactive Test Card Reference**: Modal popup with comprehensive pattern guide and examples
- **Dark Theme UI**: Professional interface optimized for 1920×1080 displays
- **Responsive Design**: Basic responsiveness for smaller viewports while maintaining 1920×1080 optimization

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment configuration:
```bash
cp .env.example .env
```

3. Edit `.env` and add your API key:
```
API_KEY=your-api-key-here
API_BASE_URL=https://service.sandbox.3dsecure.io
PORT=3002
```

4. Build the application:
```bash
npm run build
```

5. Start the proxy server:
```bash
npm start
```

6. Open http://localhost:3002 in your browser

### Development

The recommended way to run the project during development:
```bash
npm run dev
```

This will:
- Start Vite development server on http://localhost:3000 with hot module replacement
- Start the proxy server on http://localhost:3002 with auto-restart
- Proxy API calls from Vite to the backend server

Alternatively, you can run just the proxy server:
```bash
npm run server
```

## How it Works

1. **Proxy Server** (`server/proxy-server.js`):
   - Runs on port 3002 (or PORT env variable)
   - Handles CORS by proxying API calls to the 3DS sandbox
   - Serves the built application from dist/ directory
   - Logs all requests and responses
   - Reads API key from environment variables

2. **HTML Demo** (`src/index.html`):
   - Shows step-by-step authentication flow
   - Handles 3DS Method in hidden iframe
   - Displays challenge in visible iframe
   - Shows all API responses

3. **JavaScript Modules** (`src/js/modules/`):
   - `constants.js`: Test PAN configuration for all versions (178 lines)
   - `test-pans-v2.js`: Version-specific test PANs (160 lines)
   - `state.js`: Global state management (47 lines)
   - `utils.js`: Utility functions (147 lines)
   - `ui.js`: UI-related functions (176 lines)
   - `ui-reference.js`: Test card reference modal (185 lines)
   - `auth-flow.js`: Main authentication flow (178 lines)
   - `auth-flow-handlers.js`: Authentication handlers (161 lines)
   - `auth-3ds-method.js`: 3DS Method handling (65 lines)
   - `auth-challenge.js`: Challenge and post-auth handling (112 lines)

4. **Main Application** (`src/js/app.js`):
   - Entry point that imports and initializes modules
   - Exposes functions to global scope for HTML event handlers

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

## UI Layout

The application features a 3-column layout optimized for 1920×1080 displays:
- **Left Column (320px)**: TEST3DS branding, test card selection, and authentication flow status
- **Middle Column (960px)**: API responses and current status display
- **Right Column (640px)**: Challenge iframe for user interaction

### Responsive Behavior
While optimized for 1920×1080 displays, the application includes basic responsiveness:
- **1920px+**: Full optimized layout with fixed column widths (320px + 960px + 640px)
- **1536-1919px**: Slightly reduced column widths (300px + 900px + 600px)
- **1280-1535px**: Further reduced column widths (280px + 840px + 560px)
- **Below 1280px**: Columns stack vertically for mobile/tablet access
- **Inspector Tools**: Horizontal scrolling when viewport narrows (e.g., with DevTools open)

## Technologies Used

- **Backend**: Node.js with Express for the proxy server
- **Frontend**: Vanilla JavaScript ES6 modules with Tailwind CSS
- **Build System**: Vite for development and production builds
- **CSS Processing**: PostCSS with Tailwind CSS
- **Styling**: Dark theme with custom color scheme

## Environment Variables

The application uses the following environment variables:

- `API_KEY` (required): Your 3DS API key for the sandbox environment
- `API_BASE_URL` (optional): The 3DS API base URL (defaults to `https://service.sandbox.3dsecure.io`)
- `PORT` (optional): Server port (defaults to 3002)

## Project Structure

```
test3ds/
├── .env                    # Environment variables (create from .env.example)
├── .env.example           # Environment template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── package.json           # Dependencies and scripts
├── server/
│   └── proxy-server.js    # Express proxy server
├── src/                   # Source files
│   ├── index.html         # Main application UI
│   ├── css/
│   │   └── styles.css     # Tailwind CSS source
│   └── js/
│       ├── app.js         # Main entry point
│       └── modules/       # JavaScript modules
│           ├── constants.js        # Test PAN configuration
│           ├── test-pans-v2.js     # Version-specific PANs
│           ├── state.js            # State management
│           ├── utils.js            # Utility functions
│           ├── ui.js               # UI functions
│           ├── ui-reference.js     # Test card reference
│           ├── auth-flow.js        # Authentication flow
│           ├── auth-flow-handlers.js  # Auth handlers
│           ├── auth-3ds-method.js     # 3DS Method
│           └── auth-challenge.js      # Challenge flow
├── public/                # Static assets
│   ├── site.webmanifest   # PWA manifest
│   └── images/
│       ├── 3ds_logo.png
│       ├── landscape_logo.png
│       └── icons/
│           ├── favicon.ico
│           ├── favicon-16x16.png
│           ├── favicon-32x32.png
│           ├── apple-touch-icon.png
│           ├── android-chrome-192x192.png
│           └── android-chrome-512x512.png
└── dist/                  # Built files (generated)
```

## Notes

- API key must be configured in environment variables (.env file)
- Vite is used for modern development experience with HMR
- Only specific test PANs are configured in the sandbox
- The documented examples (marked with ✓) are guaranteed to work
- Custom PANs must follow the pattern rules to be valid
- JavaScript code is modularized with each file under 200 lines
- Built files are generated in the dist/ directory by Vite