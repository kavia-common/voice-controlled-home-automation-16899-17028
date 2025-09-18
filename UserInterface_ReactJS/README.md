# UserInterface_ReactJS

A lightweight React app that implements the User Interface API endpoints:
- GET/PUT: /devices/configuration
- POST: /devices/control
- GET: /devices/status

It provides:
- Device Configuration page: View and edit device configuration
- Manual Device Control page: Send commands to devices
- Device Status page: View current status, with optional auto-refresh

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed.

- REACT_APP_API_BASE_URL: Base URL of the backend exposing the User Interface API (e.g., http://localhost:8000)
- REACT_APP_API_KEY: Optional header value sent as X-API-KEY (if your backend needs it)
- REACT_APP_STATUS_POLL_INTERVAL: Optional polling interval in ms for auto-refresh on Status page (e.g., 5000). Set empty or 0 to disable.

## Development

- `npm start`: Run the app locally at http://localhost:3000
- `npm test`: Run tests
- `npm run build`: Build for production

## Folder Structure

- src/
  - api/client.js: API client with validation and error handling
  - components/UI.js: Minimal UI building blocks
  - pages/
    - DeviceConfigurationPage.js
    - ManualControlPage.js
    - DeviceStatusPage.js
  - App.js, App.css: App shell and styles
  - index.js: Entry point

## Validation & Error Handling

- Client-side validation ensures requests match the OpenAPI schemas.
- Responses are validated where schemas are defined (e.g., DeviceStatus, GET DeviceConfiguration).
- Errors are displayed via alert components on each page.

## Notes

- This app intentionally avoids routing dependencies and uses in-app navigation for simplicity.
- If the API returns additional fields, they are safely ignored.
