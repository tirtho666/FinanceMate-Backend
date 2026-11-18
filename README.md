# FinanceMate Backend API

A modular, production-ready RESTful backend service for the **FinanceMate** mobile application, built with Node.js, Express, and PostgreSQL following **Clean Architecture** principles.

## Tech Stack
- **Runtime & Framework:** Node.js, Express.js
- **Database:** PostgreSQL (Hosted on Neon)
- **Authentication & Security:** JWT (JSON Web Tokens), `bcryptjs` password hashing
- **Architecture:** Clean Architecture (`routes`, `controllers`, `repositories`, `middlewares`, `config`)

## API Endpoints
- `GET /api/health` — Verify server and database status
- `POST /api/auth/signup` — Register a new user account
- `POST /api/auth/login` — Authenticate user and receive a 30-day JWT
- `GET /api/users/profile` — Get logged-in user details (Protected)
- `PUT /api/users/profile` — Update user name, phone, or photo URL (Protected)
- `PUT /api/users/change-password` — Securely update password (Protected)
- `POST /api/transactions` — Record a new income or expense (Protected)
- `GET /api/transactions` — Fetch transactions with optional filters (`?month=this`, `?month=last`, `?category=Name`) (Protected)
- `GET /api/transactions/summary` — Get current balance, total income, and total expense (Protected)