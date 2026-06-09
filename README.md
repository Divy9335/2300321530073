# Logging Middleware App

A minimal Node.js Express application demonstrating a custom logging middleware and centralized logging service.

## Key features

- Custom logger module writing structured JSON logs to `logs/app.log`
- Express middleware that logs request and response details
- No user registration or authentication required
- Demonstrates mandatory logging integration without using `console` or built-in language loggers

## Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm start
   ```
3. Access endpoints:
   - `GET /health`
   - `GET /api/items`
   - `POST /api/items`

Logs will be written to `logs/app.log`.
