# Stage 2

## Application Overview

This Stage 2 implementation is a responsive Next.js application using Material UI to render two primary pages:

1. **All Notifications**
   - Displays the latest notifications fetched from the API.
   - Supports pagination, notification type filtering, and page-size control.
   - Marks notifications as viewed when the user clicks them.
   - Displays a badge count for newly viewed notifications.

2. **Priority Inbox**
   - Computes the top `n` notifications by combining notification weight and recency.
   - Supports type filtering and a configurable top N limit.
   - Uses the same new/read indicator behavior as the main notification list.

## Key frontend design decisions

- **Material UI only**: The UI is built with Material UI components and theming.
- **New vs viewed notifications**: `localStorage` stores viewed notification IDs. A click on a notification marks it as read.
- **Responsive layout**: The main layout and filter controls use responsive stacks and a fluid container.
- **Efficient priority selection**: The priority page fetches a larger page of notifications and selects the highest scored items.
- **Error handling**: API fetch errors surface as Material UI alerts with friendly messages.

## Notification priority logic

The priority inbox uses an algorithm based on:

- type importance: Placement > Result > Event
- recency: newer notifications receive a higher score

This is implemented in `lib/priority.js`.

## Running the app

From the `stage2-next-app` directory:

```bash
npm install
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Notes

- The app uses `API_TOKEN` if provided for API access.
- The application is intentionally lightweight and production-ready for a small campus notification system.
