# Vehicle Maintenance Scheduler Microservice

## 📌 Overview

This project is developed as part of a backend evaluation. It focuses on building a **Vehicle Maintenance Scheduler** that efficiently assigns maintenance tasks to depots while maximizing operational impact within limited resources.

The system also includes a **Logging Middleware** which is integrated across all modules to ensure proper tracking of application behavior.

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* REST APIs

---

## 📁 Project Structure

```
RA2311003011711/
│── logging_middleware/
│── vehicle_maintenance_scheduler/
│── package.json
│── .gitignore
```

---

## 🚨 Mandatory Logging Middleware

A reusable logging middleware is implemented and integrated across all functions.

### 🔹 Log Function

```
Log(stack, level, package, message)
```

### 🔹 Logging API

```
POST /evaluation-service/logs
```

### 🔹 Example Usage

```
Log("backend", "error", "handler", "received string, expected bool")
Log("backend", "fatal", "db", "critical database connection failure")
```

Logging is triggered:

* On API calls
* On errors
* On important operations

---

## 🚗 Vehicle Maintenance Scheduler

### 📌 Problem

Each vehicle task has:

* Duration (hours)
* Impact score

Each depot has:

* Limited mechanic hours

### 🎯 Objective

Select a subset of vehicles such that:

* Total duration ≤ available hours
* Total impact is maximized

👉 This is solved using an **optimization approach (similar to Knapsack Problem)**.

---

## 🔗 APIs Used

### 1. Depot API

```
GET /evaluation-service/depots
```

Returns:

```
{
  "depots": [
    { "id": 1, "mechanicHours": 60 }
  ]
}
```

---

### 2. Vehicles API

```
GET /evaluation-service/vehicles
```

Returns:

```
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

## 🧠 Approach

1. Fetch depots data
2. Fetch vehicles data
3. For each depot:

   * Apply optimization logic
   * Select best combination of tasks
4. Ensure:

   * Total duration does not exceed limit
   * Maximum impact is achieved

---

## 📊 Output

The system generates:

* Selected tasks per depot
* Total impact score
* Execution logs

---

## ▶️ How to Run

```
npm install
npm start
```

---

## 📌 Important Notes

* Logging middleware is integrated from the first function
* No hardcoded data is used
* APIs are used as provided
* Code follows modular structure

---

## 📎 Evaluation Compliance

✔ Logging Middleware implemented and integrated
✔ Backend APIs used correctly
✔ Optimization logic implemented
✔ Clean project structure
✔ Proper Git commits

---

## 👨‍💻 Author

Naman Mahajan
