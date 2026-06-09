# AffordMed Notifications (Stage 2)

A responsive Next.js and Material UI application for displaying campus notifications and priority notifications.

## Features

- `All Notifications` page with paging and type-based filtering
- `Priority Inbox` page showing top `n` notifications by type weight and recency
- Distinguishes new/unviewed notifications using browser local storage
- Uses only Material UI for styling
- Fetches notifications from `http://4.224.186.213/evaluation-service/notifications`

## Run locally

1. Install dependencies:
   ```bash
   cd stage2-next-app
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000`

## Optional API authentication

If API access requires an auth token, set:

```bash
NEXT_PUBLIC_NOTIF_API_TOKEN=your_token
```

The app sends it as `Authorization: Bearer <token>`.
