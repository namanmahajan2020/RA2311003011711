# Vehicle Maintenance Scheduler Microservice

## Overview

This project is developed as part of a backend evaluation. It focuses on building a **Vehicle Maintenance Scheduler** that efficiently assigns maintenance tasks to depots while maximizing operational impact within limited resources.

The system also includes a **Logging Middleware** which is integrated across all modules to ensure proper tracking of application behavior.

---

## Tech Stack

* Node.js
* Express.js
* REST APIs
* Axios (for API calls)

---

## Project Structure

```text
RA2311003011711/
|-- logging_middleware/
|-- vehicle_maintenance_scheduler/
|-- package.json
|-- .gitignore
```

---

## Mandatory Logging Middleware

A centralized logging middleware is implemented and used across all modules.

All logs are sent to:

```text
POST /evaluation-service/logs
```

Each log includes:

- `stack`: `backend`
- `level`: `info | error | debug | fatal`
- `package`: `service | controller | handler`
- `message`: description

Example:

```js
Log("backend", "info", "service", "Fetched depots", token)
```

Logging is used for:

- API calls
- Authentication
- Processing each depot
- Error handling

---

## Authentication

The system uses an authentication API to obtain an access token.

```text
POST /evaluation-service/auth
```

The token is then used in all API requests and logging middleware.

```text
Authorization: Bearer <token>
```

---

## Vehicle Maintenance Scheduler

### Problem

Each vehicle task has:

* Duration (hours)
* Impact score

Each depot has:

* Limited mechanic hours

### Objective

Select a subset of vehicles such that:

* Total duration <= available hours
* Total impact is maximized

This is solved using an optimization approach similar to the Knapsack Problem.

---

## APIs Used

### 1. Depot API

```text
GET /evaluation-service/depots
```

Returns:

```json
{
  "depots": [
    { "id": 1, "mechanicHours": 60 }
  ]
}
```

---

### 2. Vehicles API

```text
GET /evaluation-service/vehicles
```

Returns:

```json
{
  "vehicles": [
    {
      "taskId": "...",
      "duration": 5,
      "impact": 8
    }
  ]
}
```

---

## Approach

1. Fetch depots data
2. Fetch vehicles data
3. For each depot:
   * Apply optimization logic
   * Select best combination of tasks
4. Ensure:
   * Total duration does not exceed limit
   * Maximum impact is achieved

The optimization is implemented using dynamic programming with time complexity `O(n x capacity)`.

---

## Output

The system generates:

* Selected tasks per depot
* Total impact score
* Execution logs

---

## How to Run

```text
npm install
node vehicle_maintenance_scheduler/index.js
```

---

## Important Notes

* Logging middleware is integrated from the first function
* No hardcoded data is used
* APIs are used as provided
* Code follows modular structure

---

## Evaluation Compliance

* Logging Middleware implemented and integrated
* Backend APIs used correctly
* Optimization logic implemented
* Clean project structure
* Proper Git commits

---

## Conclusion

The system efficiently schedules vehicle maintenance tasks using an optimized approach while maintaining scalability, reliability, and proper logging for monitoring.
