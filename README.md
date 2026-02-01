# 🐒 FastRider Backend API

A backend service for managing theme-park attractions and a FastRider reservation system, including authentication, booking, cancellation, and capacity management.

Built as a take-home assignment using Fastify, PostgreSQL, Sequelize, and Docker.

---

## 🚀 Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Fastify
- **Database:** PostgreSQL
- **ORM:** Sequelize (with migrations)
- **Auth:** JWT Authentication
- **Infrastructure:** Docker & Docker Compose

---

## 📦 Features

### Core Functionality

- Areas & locations API
- Attractions vs food locations
- FastRider slot generation
- Slot capacity enforcement

### FastRider System

- Book a FastRider slot
- One active ticket per user
- Transactional booking
- Cancellation with capacity release
- Daily slot generation

### Authentication

- Phone-based one-time code (OTP)
- JWT authentication
- Rate-limited auth endpoints

---

## 🛠️ Installation & Running Locally

### Prerequisites

Ensure you have the following installed:

- Docker
- Docker Compose

> **Note:** No local Node.js or PostgreSQL installation is required.

### Step 1: Clone the repository

```bash
git clone <your-repo-url>
cd <repo-name>
```

### Step 2: Configure environment variables

The project uses a `.env` file for local development only.

Create a `.env` file in the project root:

```bash
NODE_ENV=development
PORT=3000

DB_HOST=postgres
DB_PORT=5432
DB_NAME=fastrider
DB_USER=fastrider
DB_PASSWORD=fastrider

JWT_SECRET=super_secret
AUTH_CODE_TTL_SECONDS=300
AUTH_DEV_ECHO_CODE=true
```

> **Important:**
>
> - `AUTH_DEV_ECHO_CODE=true` causes OTP codes to be returned in the response (no SMS dependency)
> - In production, this should be set to `false`

### Step 3: Start the system

```bash
docker compose up --build
```

This will:

1. Start PostgreSQL
2. Run migrations
3. Start the API on `http://localhost:3000`

### Step 4: Verify the installation

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

**Expected response:**

```json
{ "status": "ok" }
```

---

## 🔐 Authentication Flow

### Request OTP Code

**Endpoint:** `POST /auth/request-code`

**Request body:**

```json
{
  "phone": "+972500000000"
}
```

**Development response:**

```json
{
  "ok": true,
  "devCode": "123456"
}
```

> This response is only returned when `AUTH_DEV_ECHO_CODE=true`

### Verify Code & Receive JWT

**Endpoint:** `POST /auth/verify-code`

**Request body:**

```json
{
  "phone": "+972500000000",
  "code": "123456"
}
```

**Response:**

```json
{
  "token": "<JWT>"
}
```

### Using the JWT Token

Include the token in subsequent requests:

```
Authorization: Bearer <JWT>
```

---

## 🎟️ FastRider API

### Book a FastRider Ticket

**Endpoint:** `POST /fastrider/:attractionId/book`

**Headers:**

```
Authorization: Bearer <JWT>
```

**Business Rules:**

- User may have only one active FastRider ticket
- Slot capacity is enforced
- Booking is transactional

---

### Get Active Ticket

**Endpoint:** `GET /fastrider/my-ticket`

**Headers:**

```
Authorization: Bearer <JWT>
```

---

### Cancel Active Ticket

**Endpoint:** `POST /fastrider/cancel`

**Headers:**

```
Authorization: Bearer <JWT>
```

**Cancellation behavior:**

- Marks ticket as `CANCELLED`
- Releases slot capacity

---

## ⏱️ Rate Limiting

Authentication endpoints are protected against abuse:

| Endpoint             | Limit                     |
| -------------------- | ------------------------- |
| `/auth/request-code` | 5 requests / minute / IP  |
| `/auth/verify-code`  | 10 requests / minute / IP |

This prevents brute-force attempts and system abuse.

---

## 🧠 Design Decisions & Assumptions

### Authentication

- OTP codes are stored hashed for security
- JWT is used for stateless authentication
- Phone-based auth was chosen for simplicity

### Slot Generation

- Slots are generated daily
- Currently triggered on application startup
- In production, this would be handled by a scheduled job (cron)

### Transactions & Locking

- Booking and cancellation are fully transactional
- Explicit row-level locking is used to avoid race conditions
- PostgreSQL locking constraints are respected (no locking on outer joins)

### Environment Separation

- `.env` is used for local development
- Docker Compose injects environment variables
- No secrets are hard-coded

---

## ⚠️ Limitations / Future Improvements

- [ ] Replace OTP echo with real SMS provider
- [ ] Add user profile endpoint
- [ ] Add admin endpoints for attraction management
- [ ] Add pagination & filtering
- [ ] Improve observability (metrics, tracing)

---

## 🧪 Development Notes

- All database changes are handled via migrations
- The system can be started from a clean state using Docker
- No manual DB setup is required
