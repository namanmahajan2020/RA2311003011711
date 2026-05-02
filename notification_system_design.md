# Stage 1 - API Design & Real-time Notifications

## System Architecture

```text
Client (Web/App)
        |
        v
   API Gateway
        |
        v
 Notification Service
        |
   ---------------------
   |        |         |
 Database   Cache    Queue
(Postgres) (Redis) (Kafka/RabbitMQ)
                    |
                    v
               Worker Service
                    |
          -------------------
          |                 |
      Email Service    Push Notifications
```

## Objective

Design REST APIs for a notification system where students receive updates like placements, results, and events.

## Core APIs

### 1. Get Notifications

`GET /notifications`

Query Params:

- `studentId`
- `page`
- `limit`

Response:

```json
{
  "notifications": [
    {
      "id": "123",
      "type": "Placement",
      "message": "Company hiring",
      "timestamp": "2026-04-22T17:51:18"
    }
  ]
}
```

### 2. Mark as Read

`POST /notifications/read`

```json
{
  "notificationId": "123"
}
```

### 3. Create Notification

`POST /notifications`

```json
{
  "type": "Event",
  "message": "Tech Fest"
}
```

## Headers

- `Authorization: Bearer <token>`
- `Content-Type: application/json`

## Real-time Mechanism

Use WebSockets / Socket.IO.

- Server pushes notifications instantly
- Client listens for updates

## Logging Integration

```js
Log("backend", "info", "service", "Fetched notifications", token);
```

### Logging Strategy

Logging middleware is used in every API call to track:

- request start
- success
- errors

Example:

```js
Log("backend", "info", "service", "Fetched notifications", token);
```

# Stage 2 - Database Design

## Choice: PostgreSQL

Why:

- Structured data
- Strong indexing
- ACID compliance

## Schema

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  student_id INT,
  type VARCHAR,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP
);
```

## Problems with Large Data

- Slow queries
- Index inefficiency
- High I/O

## Solutions

Indexing:

```sql
CREATE INDEX idx_student_id ON notifications(student_id);
```

- Partitioning by date
- Pagination using `limit + offset`

# Stage 3 - Query Optimization

## Bad Query

```sql
SELECT *
FROM notifications
WHERE studentId = 1042 AND isRead = false
ORDER BY createdAt DESC;
```

## Problems

- Full table scan
- No index
- Slow sorting

## Optimized Query

```sql
SELECT id, type, message, createdAt
FROM notifications
WHERE studentId = 1042 AND isRead = false
ORDER BY createdAt DESC
LIMIT 50;
```

## Improvements

Added index:

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentId, isRead, createdAt DESC);
```

- Reduced columns
- Limited results

# Stage 4 - Performance Optimization

## Problem

Fetching notifications on every page load can overload the database.

## Solutions

1. Caching (Redis)
   Store recent notifications and reduce DB hits.
2. Lazy Loading
   Load only when needed.
3. Pagination
   Avoid large queries.
4. WebSockets
   Push instead of pull.

## Trade-offs

| Solution | Advantage | Disadvantage |
| --- | --- | --- |
| Cache | Fast | Stale data |
| Pagination | Efficient | More API calls |
| WebSocket | Real-time | Complex setup |

System is horizontally scalable by:

- deploying multiple instances
- using a load balancer
- following stateless API design

# Stage 5 - Reliable Notification System

## Current Problem

Email sending may fail midway, with no retry and inconsistent database state.

## Issues

- Partial failures
- Blocking execution
- No fault tolerance

## Improved Design

Use a queue system such as Kafka or RabbitMQ.

## Updated Flow

1. Save notification to DB
2. Push notification to queue
3. Worker processes:
   - send email
   - send push
   - retry on failure

## Improved Pseudocode

```python
def notify_all_students(student_ids, message):
    for student in student_ids:
        save_to_db(student, message)
        queue.publish(student, message)
```

Worker:

```python
while True:
    job = queue.consume()
    try:
        send_email(job)
    except:
        retry(job)
```

## Benefits

- Fault tolerant
- Retry mechanism
- Scalable

Using message queues ensures eventual consistency and fault tolerance.

# Stage 6 - Top 10 Priority Notifications

## Logic

Priority is based on:

- Placement > Result > Event
- Recent timestamp

## SQL Query

```sql
SELECT *
FROM notifications
ORDER BY
  CASE
    WHEN type = 'Placement' THEN 3
    WHEN type = 'Result' THEN 2
    ELSE 1
  END DESC,
  createdAt DESC
LIMIT 10;
```

## Approach

- Use priority scoring
- Combine type and recency
- Always keep a sorted top 10

## Handling New Notifications

Use a min heap of size 10 and replace the lowest priority item when a better notification arrives.

## Code Approach (JS)

```js
notifications.sort((a, b) => {
  const priority = { Placement: 3, Result: 2, Event: 1 };
  return priority[b.type] - priority[a.type] ||
    new Date(b.timestamp) - new Date(a.timestamp);
});

return notifications.slice(0, 10);
```

# Final Notes

- Logging middleware used
- APIs defined
- DB optimized
- Scalable system design
- Production-ready approach

## Conclusion

The system is scalable, fault-tolerant, and optimized for real-time delivery with efficient logging and database performance.
