# Stage 1

## Overview
A priority inbox system that fetches campus notifications from the API and displays the top 10 most important unread notifications based on a scoring algorithm.

## Priority Scoring Logic

Each notification gets a score based on two factors:

### 1. Type Weight
| Type | Weight |
|------|--------|
| Placement | 3 |
| Result | 2 |
| Event | 1 |

### 2. Recency
Within the same type, more recent notifications rank higher using their Unix timestamp.

### Formula
score = (typeWeight * 1000000) + unixTimestamp
Multiplying weight by 1,000,000 ensures type always takes priority over recency. So a slightly older Placement will always rank above any Result or Event.

## Handling New Notifications Efficiently

Since new notifications keep coming in, the system polls the API every 30 seconds using `setInterval`. Each poll:
1. Fetches all current notifications
2. Recalculates scores
3. Re-sorts and displays the updated top 10

This approach is efficient because:
- No database needed — we compute on the fly
- No stale data — every poll gets fresh notifications
- Minimal memory usage — only top 10 are kept in memory at a time

## Logging
All major events (fetch, score, errors, polling) are logged using the custom Logging Middleware which sends logs to the Affordmed log API.

## Tech Stack
- Runtime: Node.js
- Language: JavaScript
- Logging: Custom logging_middleware package