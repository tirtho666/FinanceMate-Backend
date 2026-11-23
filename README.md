# FinanceMate Backend

REST API service powering the **FinanceMate** mobile application. Built with Node.js, Express, and PostgreSQL, the backend handles user authentication, profile management, transaction CRUD operations, and financial summary calculations using a clean, layered architecture.

- **Mobile App (Frontend):** [github.com/tirtho666/FinanceMate](https://github.com/tirtho666/FinanceMate)
- **Live Base URL:** `https://financemate-backend.onrender.com`

## Tech Stack

- **Runtime & Framework:** Node.js, Express.js
- **Database:** PostgreSQL (hosted on Neon)
- **Authentication & Security:** JSON Web Tokens (30-day expiry), `bcryptjs` password hashing
- **Hosting:** Render

## Project Structure

The source code inside `src/` is organized by responsibility:

- **`config/`** — Environment variables and PostgreSQL connection pool setup
- **`middlewares/`** — JWT verification, request validation, and centralized error handling
- **`routes/`** — Express route definitions for auth, users, and transactions
- **`controllers/`** — HTTP request parsing and response formatting
- **`repositories/`** — Parameterized SQL queries and database interactions

## API Endpoints

### Health & Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Check server and database connectivity |
| `POST` | `/api/auth/signup` | Public | Create a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user and return a 30-day JWT |

### User Profile
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Bearer Token | Fetch authenticated user details |
| `PUT` | `/api/users/profile` | Bearer Token | Update user name, phone number, or photo URL |
| `PUT` | `/api/users/change-password` | Bearer Token | Change account password |

### Transactions & Summary
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/transactions` | Bearer Token | Record a new income or expense |
| `GET` | `/api/transactions` | Bearer Token | List transactions (supports date range and category filters) |
| `PUT` | `/api/transactions/:id` | Bearer Token | Update an existing transaction |
| `DELETE` | `/api/transactions/:id` | Bearer Token | Delete a transaction by ID |
| `GET` | `/api/transactions/summary` | Bearer Token | Calculate current balance, total income, and total expense |

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/tirtho666/FinanceMate-Backend.git](https://github.com/tirtho666/FinanceMate-Backend.git)
   cd FinanceMate-Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your PostgreSQL connection string and JWT secret:
   ```bash
   cp .env.example .env
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
