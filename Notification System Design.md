# Stage 1

## Objective
Build a Priority Inbox that returns the top 10 unread notifications ordered by importance and recency. Notifications are fetched from the provided API, scored, and ranked without using a database.

## Priority strategy

- `placement` notifications receive the highest base weight.
- `result` notifications receive medium weight.
- `event` notifications receive lower base weight.
- Newer notifications are ranked higher within the same category.
- The final score is a weighted combination of the notification type and its age.

## Scoring formula

1. Assign a base weight by notification type:
   - `placement`: 1000
   - `result`: 700
   - `event`: 400
   - Unknown types: 100
2. Compute recency impact:
   - Calculate age in hours from the notification timestamp.
   - Apply a recency boost that decreases with age.
3. Final score = `baseWeight * 1000 + recencyBoost`

This ensures category importance dominates while recency still influences the ordering between similarly important notifications.

## Efficient top-10 maintenance

To keep the top 10 notifications efficiently as new notifications arrive, use a fixed-size min-heap:

- Maintain the heap with at most `k` items.
- For each incoming notification:
  - If heap size is less than `k`, add the notification.
  - Otherwise, compare the new score to the heap root (current smallest score).
  - Replace the root only if the new notification has a higher score.
- Insertion and replacement cost `O(log k)`, which is efficient for streaming updates.

This design handles a constantly growing notification feed while preserving only the most relevant items.

## Implementation details

- `src/stage1PriorityInbox.js`:
  - Fetches notifications from `http://4.224.186.213/evaluation-service/notifications`.
  - Accepts an authorization bearer token via the environment variable `NOTIF_API_TOKEN`.
  - Uses `src/logger.js` for structured file-based logging.
  - Writes the computed top 10 list to `stage1/top10-notifications.json`.

## Usage

```bash
npm run stage1
```

If the API has authorization enabled, set the token first:

```bash
$env:NOTIF_API_TOKEN = 'YOUR_TOKEN'
npm run stage1
```

## Notes

- The implementation avoids hard-coding notification records.
- The top-10 algorithm is designed for real-time streaming ingestion.
- The logging module from the pre-test setup is reused for all script operations.
