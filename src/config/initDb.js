const pool = require('./db');

const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    photo_url TEXT
  );
`;

const CREATE_TRANSACTIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount NUMERIC(12, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date TIMESTAMP NOT NULL,
    note TEXT
  );
`;

const initDatabase = async () => {
  await pool.query(CREATE_USERS_TABLE);
  console.log('Database initialized: users table is ready');

  await pool.query(CREATE_TRANSACTIONS_TABLE);
  console.log('Database initialized: transactions table is ready');
};

module.exports = initDatabase;
