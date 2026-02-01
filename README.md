🐒 FastRider Backend API

A backend service for managing theme-park attractions and a FastRider reservation system, including authentication, booking, cancellation, and capacity management.

Built as a take-home assignment using Fastify, PostgreSQL, Sequelize, and Docker.

🚀 Tech Stack

Node.js + TypeScript

Fastify

PostgreSQL

Sequelize (ORM + migrations)

JWT Authentication

Docker & Docker Compose

📦 Features
Core

Areas & locations API

Attractions vs food locations

FastRider slot generation

Slot capacity enforcement

FastRider System

Book a FastRider slot

One active ticket per user

Transactional booking

Cancellation with capacity release

Daily slot generation

Authentication

Phone-based one-time code (OTP)

JWT authentication

Rate-limited auth endpoints

🛠️ Installation & Running Locally
Prerequisites

Docker

Docker Compose

No local Node.js or PostgreSQL installation is required.

1️⃣ Clone the repository
git clone <your-repo-url>
cd <repo-name>

2️⃣ Environment variables

The project uses a .env file for local development only.

Create a .env file in the project root:

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

📌 Notes:

AUTH_DEV_ECHO_CODE=true causes OTP codes to be returned in the response (no SMS dependency).

In production this should be false.

3️⃣ Start the system
docker compose up --build

This will:

Start PostgreSQL

Run migrations

Start the API on http://localhost:3000

4️⃣ Health check
curl http://localhost:3000/health

Expected response:

{ "status": "ok" }

🔐 Authentication Flow
Request OTP code
POST /auth/request-code

{ "phone": "+972500000000" }

Dev response (only in development):

{ "ok": true, "devCode": "123456" }

Verify code & receive JWT
POST /auth/verify-code

{ "phone": "+972500000000", "code": "123456" }

Response:

{ "token": "<JWT>" }

Use this token in subsequent requests:

Authorization: Bearer <JWT>

🎟️ FastRider API
Book a FastRider ticket
POST /fastrider/:attractionId/book
Authorization: Bearer <JWT>

Rules:

User may have only one active FastRider ticket

Slot capacity is enforced

Booking is transactional

Get active ticket
GET /fastrider/my-ticket
Authorization: Bearer <JWT>

Cancel active ticket
POST /fastrider/cancel
Authorization: Bearer <JWT>

Cancelling:

Marks ticket as CANCELLED

Releases slot capacity

⏱️ Rate Limiting

Authentication endpoints are protected:

/auth/request-code
5 requests / minute / IP

/auth/verify-code
10 requests / minute / IP

This prevents abuse and brute-force attempts.

🧠 Design Decisions & Assumptions

Authentication

OTP codes are stored hashed

JWT is used for stateless auth

Phone-based auth was chosen for simplicity

Slot Generation

Slots are generated daily

Currently triggered on application startup

In production this would be handled by a scheduled job (cron)

Transactions & Locking

Booking and cancellation are fully transactional

Explicit row-level locking is used to avoid race conditions

PostgreSQL locking constraints are respected (no locking on outer joins)

Environment Separation

.env is used for local development

Docker Compose injects environment variables

No secrets are hard-coded

⚠️ Limitations / Future Improvements

Replace OTP echo with real SMS provider

Add user profile endpoint

Add admin endpoints for attraction management

Add pagination & filtering

Improve observability (metrics, tracing)

🧪 Development Notes

All database changes are handled via migrations

The system can be started from a clean state using Docker

No manual DB setup is required
