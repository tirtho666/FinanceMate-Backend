const pool = require('../config/db');

const createTransaction = async ({ userId, type, amount, category, date, note }) => {
  const { rows } = await pool.query(
    `INSERT INTO transactions (user_id, type, amount, category, date, note)
     VALUES ($1, $2, $3, $4, COALESCE($5, NOW()), $6)
     RETURNING id, user_id, type, amount, category, date, note`,
    [userId, type, amount, category, date || null, note || null]
  );

  return rows[0];
};

const findByUserId = async (userId, { month, category } = {}) => {
  const conditions = ['user_id = $1'];
  const values = [userId];

  if (month === 'this') {
    conditions.push("date >= date_trunc('month', CURRENT_DATE)");
    conditions.push("date < date_trunc('month', CURRENT_DATE) + interval '1 month'");
  } else if (month === 'last') {
    conditions.push("date >= date_trunc('month', CURRENT_DATE) - interval '1 month'");
    conditions.push("date < date_trunc('month', CURRENT_DATE)");
  }

  if (category) {
    values.push(category);
    conditions.push(`category ILIKE $${values.length}`);
  }

  const { rows } = await pool.query(
    `SELECT id, user_id, type, amount, category, date, note
     FROM transactions
     WHERE ${conditions.join(' AND ')}
     ORDER BY date DESC`,
    values
  );

  return rows;
};

const getSummary = async (userId) => {
  const { rows } = await pool.query(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
       COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
       COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS current_balance
     FROM transactions
     WHERE user_id = $1`,
    [userId]
  );

  const summary = rows[0];
  return {
    current_balance: Number(summary.current_balance),
    total_income: Number(summary.total_income),
    total_expense: Number(summary.total_expense),
  };
};

module.exports = { createTransaction, findByUserId, getSummary };
