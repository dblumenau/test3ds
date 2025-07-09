# 3D Secure v2.2.0 Browser Demo

This demo shows a complete 3D Secure v2.2.0 authentication flow in the browser, including:
- Pre-authentication enrollment check
- 3DS Method handling (browser fingerprinting)
- Challenge flow in iframe
- Post-authentication result retrieval

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

## Test Card

The demo is pre-configured with card `3000100911112172`:
- Supports v2.2.0 only
- No 3DS Method URL
- Requires manual challenge interaction
- Challenge requires user action (not auto-complete)

## Authentication Flow

1. **Pre-Authentication**: Checks if card is enrolled
2. **3DS Method**: Browser fingerprinting (if available)
3. **Authentication**: Main authentication request
4. **Challenge**: User completes challenge in iframe
5. **Post-Authentication**: Retrieves final result

## API Endpoints

All API calls go through the proxy:
- `/api/3ds/preauth` → `https://service.sandbox.3dsecure.io/preauth`
- `/api/3ds/auth` → `https://service.sandbox.3dsecure.io/auth`
- `/api/3ds/postauth` → `https://service.sandbox.3dsecure.io/postauth`

## Callback URLs

The demo uses `http://echo.localhost` for callbacks:
- 3DS Method: `http://echo.localhost/3ds-method-notification`
- Challenge: `http://echo.localhost/notification`