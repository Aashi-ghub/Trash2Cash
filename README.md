# API Endpoints Documentation

This document outlines the API endpoints available in the Eco-Hive Network backend project, along with their expected request and response formats.

---

## Admin Endpoints (`src/routes/admin.js`)

### 1. GET /overview

*   **Authentication:** Required (operator or admin role)
*   **Description:** Provides a minimal overview of the number of bins, events, and users.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "bins": <number_of_bins>,
        "events": <number_of_events>,
        "users": <number_of_users>
      }
    }
    ```
*   **Error Response (403 Forbidden):**
    ```json
    {
      "status": "error",
      "message": "Forbidden"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

---

## Analytics Endpoints (`src/routes/analytics.js`)

### 1. GET /api/analytics/insights/:binId

*   **Authentication:** Private
*   **Description:** Get AI insights for a specific bin.
*   **Success Response (200 OK):** Returns an array of insight objects.
    ```json
    [
      {
        "id": "uuid",
        "created_at": "timestamp",
        "insight_data": {},
        "bin_events": {
          "id": "uuid",
          "bin_id": "uuid",
          // ... other bin_events properties
        }
      }
    ]
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "msg": "No insights found for this bin."
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    "Server error"
    ```

### 2. GET /api/analytics/anomalies/:binId

*   **Authentication:** Private
*   **Description:** Get anomalies for a specific bin.
*   **Success Response (200 OK):** Returns an array of anomaly objects.
    ```json
    [
      {
        "id": "uuid",
        "created_at": "timestamp",
        "bin_id": "uuid",
        "anomaly_data": {}
        // ... other anomaly properties
      }
    ]
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "msg": "No anomalies found for this bin."
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    "Server error"
    ```

### 3. GET /api/analytics/rewards/me

*   **Authentication:** Private
*   **Description:** Get rewards history for the authenticated user.
*   **Success Response (200 OK):** Returns an array of reward ledger entries.
    ```json
    [
      {
        "id": "uuid",
        "created_at": "timestamp",
        "user_id": "uuid",
        "points_earned": 10,
        // ... other reward properties
      }
    ]
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    "Server error"
    ```

### 4. GET /api/analytics/rewards/summary

*   **Authentication:** Private
*   **Description:** Get a summary of rewards for the authenticated user.
*   **Success Response (200 OK):**
    ```json
    {
      "total_points": <number>,
      "total_events": <number>,
      "badges": [
        {
          "badge_name": "string",
          "achieved_at": "timestamp"
        }
      ]
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    "Server error"
    ```

### 5. GET /api/analytics/dashboard-stats/me

*   **Authentication:** Private
*   **Description:** Get dashboard stats for the authenticated user.
*   **Success Response (200 OK):** Returns a single dashboard stats object.
    ```json
    {
      "user_id": "uuid",
      "stat1": "value1",
      "stat2": "value2"
      // ... other dashboard stats properties
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "msg": "No dashboard stats found for this user."
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    "Server error"
    ```

---

## Bin Endpoints (`src/routes/bins.js`)

### 1. GET /bins/

*   **Authentication:** Admin/Operator only (implied)
*   **Description:** Get all bins.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "uuid",
          "bin_code": "string",
          "owner_user_id": "uuid",
          "location": "string",
          "created_at": "timestamp"
          // ... other bin properties
        }
      ],
      "count": <number_of_bins>
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to fetch bins",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 2. GET /bins/:binId

*   **Authentication:** None specified
*   **Description:** Get bin by ID.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "id": "uuid",
        "bin_code": "string",
        "owner_user_id": "uuid",
        "location": "string",
        "created_at": "timestamp"
        // ... other bin properties
      }
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "status": "error",
      "message": "Bin not found"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to fetch bin",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 3. GET /bins/user/:userId

*   **Authentication:** None specified
*   **Description:** Get bins by user ID.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "uuid",
          "bin_code": "string",
          "owner_user_id": "uuid",
          "location": "string",
          "created_at": "timestamp"
          // ... other bin properties
        }
      ],
      "count": <number_of_bins>
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to fetch bins for user",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 4. POST /bins/

*   **Authentication:** None specified
*   **Description:** Create a new bin.
*   **Request Body:**
    ```json
    {
      "bin_code": "string",
      "owner_user_id": "uuid",
      "location": "string" (optional)
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "status": "success",
      "data": {
        "id": "uuid",
        "bin_code": "string",
        "owner_user_id": "uuid",
        "location": "string",
        "created_at": "timestamp"
        // ... other bin properties
      }
    }
    ```
*   **Error Response (400 Bad Request - Validation):**
    ```json
    {
      "status": "error",
      "message": "Validation error",
      "details": []
    }
    ```
*   **Error Response (409 Conflict - Duplicate Bin Code):**
    ```json
    {
      "status": "error",
      "message": "Bin with this code already exists"
    }
    ```
*   **Error Response (400 Bad Request - Referenced User Does Not Exist):**
    ```json
    {
      "status": "error",
      "message": "Referenced user does not exist"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to create bin",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 5. PUT /bins/:binId

*   **Authentication:** None specified
*   **Description:** Update a bin.
*   **Request Body:**
    ```json
    {
      "location": "string" (optional)
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "id": "uuid",
        "bin_code": "string",
        "owner_user_id": "uuid",
        "location": "string",
        "created_at": "timestamp"
        // ... updated bin properties
      }
    }
    ```
*   **Error Response (400 Bad Request - Validation):**
    ```json
    {
      "status": "error",
      "message": "Validation error",
      "details": []
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "status": "error",
      "message": "Bin not found"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to update bin",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 6. POST /bins/:binId/assign

*   **Authentication:** None specified
*   **Description:** Assign/Reassign a bin to a host (owner_user_id).
*   **Request Body:**
    ```json
    {
      "owner_user_id": "uuid"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "id": "uuid",
        "bin_code": "string",
        "owner_user_id": "uuid",
        "location": "string",
        "created_at": "timestamp"
        // ... updated bin properties
      }
    }
    ```
*   **Error Response (400 Bad Request - Validation):**
    ```json
    {
      "status": "error",
      "message": "Validation error",
      "details": []
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "status": "error",
      "message": "Bin not found"
    }
    ```
*   **Error Response (400 Bad Request - Referenced User Does Not Exist):**
    ```json
    {
      "status": "error",
      "message": "Referenced user does not exist"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to assign bin",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 7. DELETE /bins/:binId

*   **Authentication:** None specified
*   **Description:** Delete a bin.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Bin deleted successfully"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to delete bin",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 8. GET /bins/:binId/stats

*   **Authentication:** None specified
*   **Description:** Get bin summary statistics.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "bin_id": "uuid",
        "total_events": "number",
        "last_event_at": "timestamp"
        // ... other stats properties
      }
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "status": "error",
      "message": "Bin not found"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to fetch bin statistics",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

---

## Device Key Endpoints (`src/routes/deviceKeys.js`)

### 1. POST /device-keys/

*   **Authentication:** None specified (implied admin/internal use)
*   **Description:** Create a device key for a bin.
*   **Request Body:**
    ```json
    {
      "bin_id": "uuid"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "status": "success",
      "data": {
        "id": "uuid",
        "bin_id": "uuid",
        "api_key": "uuid"
      }
    }
    ```
*   **Error Response (400 Bad Request - Validation):**
    ```json
    {
      "status": "error",
      "message": "Validation error",
      "details": []
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "status": "error",
      "message": "Bin not found"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to create device key",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 2. POST /device-keys/:id/revoke

*   **Authentication:** None specified (implied admin/internal use)
*   **Description:** Revoke (delete) a device key.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Device key revoked"
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "status": "error",
      "message": "Device key not found"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 3. GET /device-keys/bin/:binId

*   **Authentication:** None specified (implied admin/internal use)
*   **Description:** List device keys by bin ID.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "uuid",
          "bin_id": "uuid",
          "api_key": "uuid",
          "created_at": "timestamp"
          // ... other device key properties
        }
      ],
      "count": <number_of_keys>
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to list device keys",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

---

## Event Endpoints (`src/routes/events.js`)

### 1. GET /events/

*   **Authentication:** Admin/Operator only (implied)
*   **Description:** Get all events with optional filtering and pagination.
*   **Query Parameters:**
    *   `limit`: Number of events to return (default: 100)
    *   `offset`: Number of events to skip (default: 0)
    *   `bin_id`: Filter by bin ID
    *   `start_date`: Filter by start date (ISO format)
    *   `end_date`: Filter by end date (ISO format)
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "uuid",
          "bin_id": "uuid",
          "timestamp_utc": "timestamp",
          "fill_level_pct": "number",
          "weight_kg_total": "number",
          "battery_pct": "number",
          "categories": {},
          "payload_json": {}
          // ... other event properties
        }
      ],
      "count": <number_of_events>,
      "pagination": {
        "limit": "number",
        "offset": "number"
      }
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to fetch events",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 2. GET /events/:eventId

*   **Authentication:** None specified
*   **Description:** Get event by ID.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "id": "uuid",
        "bin_id": "uuid",
        "timestamp_utc": "timestamp",
        "fill_level_pct": "number",
        "weight_kg_total": "number",
        "battery_pct": "number",
        "categories": {},
        "payload_json": {}
        // ... other event properties
      }
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "status": "error",
      "message": "Event not found"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to fetch event",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 3. GET /events/bin/:binId

*   **Authentication:** None specified
*   **Description:** Get events by bin ID with optional filtering and pagination.
*   **Query Parameters:**
    *   `limit`: Number of events to return (default: 100)
    *   `offset`: Number of events to skip (default: 0)
    *   `start_date`: Filter by start date (ISO format)
    *   `end_date`: Filter by end date (ISO format)
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "uuid",
          "bin_id": "uuid",
          "timestamp_utc": "timestamp",
          "fill_level_pct": "number",
          "weight_kg_total": "number",
          "battery_pct": "number",
          "categories": {},
          "payload_json": {}
          // ... other event properties
        }
      ],
      "count": <number_of_events>,
      "pagination": {
        "limit": "number",
        "offset": "number"
      }
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to fetch events for bin",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 4. POST /events/

*   **Authentication:** `deviceAuth` middleware (device key required)
*   **Description:** Create a new event (IoT device ingestion). Enforces scoped insert to the device's bin if authenticated.
*   **Request Body:**
    ```json
    {
      "bin_id": "uuid",
      "bin_code": "string" (optional),
      "location": "string" (optional),
      "timestamp_utc": "ISO date string",
      "fill_level_pct": "number (0-100)",
      "weight_kg_total": "number (positive)",
      "weight_kg_delta": "number" (optional),
      "battery_pct": "number (0-100)",
      "categories": {} (optional),
      "ai_model_id": "string" (optional),
      "ai_confidence_avg": "number (0-1)" (optional),
      "payload_json": {},
      "hv_count": "integer (>=0)" (optional),
      "lv_count": "integer (>=0)" (optional),
      "org_count": "integer (>=0)" (optional)
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "status": "success",
      "data": {
        "id": "uuid",
        "bin_id": "uuid",
        "timestamp_utc": "timestamp"
        // ... other created event properties
      }
    }
    ```
*   **Error Response (400 Bad Request - Validation):**
    ```json
    {
      "status": "error",
      "message": "Validation error",
      "details": []
    }
    ```
*   **Error Response (403 Forbidden - Device cannot write to this bin_id):**
    ```json
    {
      "status": "error",
      "message": "Device cannot write to this bin_id"
    }
    ```
*   **Error Response (400 Bad Request - Referenced bin does not exist):**
    ```json
    {
      "status": "error",
      "message": "Referenced bin does not exist"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to create event",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 5. POST /events/bulk

*   **Authentication:** None specified
*   **Description:** Bulk create events for batch processing.
*   **Request Body:**
    ```json
    {
      "events": [
        {
          "bin_id": "uuid",
          "timestamp_utc": "ISO date string",
          "fill_level_pct": "number (0-100)",
          "weight_kg_total": "number (positive)",
          "battery_pct": "number (0-100)",
          "payload_json": {}
          // ... other event properties (same as single event creation)
        }
        // ... multiple event objects
      ]
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "uuid",
          "bin_id": "uuid",
          "timestamp_utc": "timestamp"
        }
        // ... multiple created event objects (with id, bin_id, timestamp_utc)
      ],
      "count": <number_of_events_created>
    }
    ```
*   **Error Response (400 Bad Request - Validation):**
    ```json
    {
      "status": "error",
      "message": "Events array is required and must not be empty"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Validation error at index <index>",
      "details": []
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to create events",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 6. PUT /events/:eventId

*   **Authentication:** None specified
*   **Description:** Update an event.
*   **Request Body:**
    ```json
    {
      "fill_level_pct": "number (0-100)" (optional),
      "weight_kg_total": "number (positive)" (optional),
      "weight_kg_delta": "number" (optional),
      "battery_pct": "number (0-100)" (optional),
      "ai_model_id": "string" (optional),
      "ai_confidence_avg": "number (0-1)" (optional),
      "payload_json": {} (optional),
      "hv_count": "integer (>=0)" (optional),
      "lv_count": "integer (>=0)" (optional),
      "org_count": "integer (>=0)" (optional)
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "id": "uuid",
        "bin_id": "uuid",
        "timestamp_utc": "timestamp"
        // ... updated event properties
      }
    }
    ```
*   **Error Response (400 Bad Request - Validation):**
    ```json
    {
      "status": "error",
      "message": "Validation error",
      "details": []
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "status": "error",
      "message": "Event not found"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to update event",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 7. DELETE /events/:eventId

*   **Authentication:** None specified
*   **Description:** Delete an event.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Event deleted successfully"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to delete event",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

---

## User Endpoints (`src/routes/users.js`)

### 1. POST /api/users/register

*   **Authentication:** Public
*   **Description:** Register a new user.
*   **Request Body:**
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string",
      "role": "string" (optional, default: "host")
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "string"
    }
    ```
*   **Error Response (400 Bad Request):**
    ```json
    {
      "msg": "Please enter all fields"
    }
    ```
    or
    ```json
    {
      "msg": "User already exists"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    "Server error"
    ```

### 2. POST /api/users/login

*   **Authentication:** Public
*   **Description:** Authenticate user and get token.
*   **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "token": "jwt_token_string"
    }
    ```
*   **Error Response (400 Bad Request):**
    ```json
    {
      "msg": "Please provide email and password"
    }
    ```
    or
    ```json
    {
      "msg": "Invalid credentials"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    "Server error"
    ```

### 3. GET /users/

*   **Authentication:** Admin only (implied)
*   **Description:** Get all users.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": [
        {
          "user_id": "uuid",
          "display_name": "string",
          "role": "string",
          "created_at": "timestamp"
          // ... other profile properties
        }
      ],
      "count": <number_of_users>
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to fetch users",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 4. GET /users/:userId

*   **Authentication:** None specified
*   **Description:** Get user by ID.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "user_id": "uuid",
        "display_name": "string",
        "role": "string",
        "created_at": "timestamp"
        // ... other profile properties
      }
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "status": "error",
      "message": "User not found"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to fetch user",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 5. POST /users/

*   **Authentication:** None specified
*   **Description:** Create a new user (profile).
*   **Request Body:**
    ```json
    {
      "display_name": "string",
      "role": "string"
      // ... other user profile fields
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "status": "success",
      "data": {
        "user_id": "uuid",
        "display_name": "string",
        "role": "string",
        "created_at": "timestamp"
        // ... other created profile properties
      }
    }
    ```
*   **Error Response (400 Bad Request - Validation):**
    ```json
    {
      "status": "error",
      "message": "Validation error",
      "details": []
    }
    ```
*   **Error Response (409 Conflict - Duplicate User):**
    ```json
    {
      "status": "error",
      "message": "User with this email already exists"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to create user",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 6. POST /users/admin-create

*   **Authentication:** None specified
*   **Description:** Admin-create new user through Supabase Auth Admin API, then sync to profiles.
*   **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string",
      "role": "string",
      "display_name": "string" (optional),
      "contact_phone": "string" (optional),
      "contact_address": "string" (optional)
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "status": "success",
      "data": {
        "auth_user": {
          "id": "uuid",
          "email": "string"
          // ... other auth user properties
        },
        "profile": {
          "user_id": "uuid",
          "display_name": "string",
          "role": "string"
          // ... other profile properties
        }
      }
    }
    ```
*   **Partial Success Response (201 Created):**
    ```json
    {
      "status": "partial_success",
      "message": "Auth user created, but failed to sync profile",
      "data": {
        "auth_user": {
          "id": "uuid",
          "email": "string"
          // ... other auth user properties
        }
      },
      "warning": "error message"
    }
    ```
*   **Error Response (400 Bad Request - Validation):**
    ```json
    {
      "status": "error",
      "message": "Validation error",
      "details": []
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to create auth user",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 7. PUT /users/:userId

*   **Authentication:** None specified
*   **Description:** Update user profile.
*   **Request Body:**
    ```json
    {
      "display_name": "string" (optional),
      "role": "string" (optional)
      // ... other updatable user profile fields
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "user_id": "uuid",
        "display_name": "string",
        "role": "string",
        "created_at": "timestamp"
        // ... updated profile properties
      }
    }
    ```
*   **Error Response (400 Bad Request - Validation):**
    ```json
    {
      "status": "error",
      "message": "Validation error",
      "details": []
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "status": "error",
      "message": "User not found"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to update user",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```

### 8. DELETE /users/:userId

*   **Authentication:** None specified
*   **Description:** Delete user profile.
*   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "message": "User deleted successfully"
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
      "status": "error",
      "message": "Failed to delete user",
      "error": "error message"
    }
    ```
    or
    ```json
    {
      "status": "error",
      "message": "Internal server error"
    }
    ```
