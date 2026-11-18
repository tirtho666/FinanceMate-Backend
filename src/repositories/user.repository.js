const pool = require('../config/db');

const createUser = async ({ fullName, email, passwordHash, phoneNumber, photoUrl }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, phone_number, photo_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, email, phone_number, photo_url`,
    [fullName, email, passwordHash, phoneNumber || null, photoUrl || null]
  );

  return rows[0];
};

const findByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, full_name, email, phone_number, photo_url FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

const updateProfile = async (id, { fullName, phoneNumber, photoUrl }) => {
  const { rows } = await pool.query(
    `UPDATE users
     SET full_name = COALESCE($2, full_name),
         phone_number = COALESCE($3, phone_number),
         photo_url = COALESCE($4, photo_url)
     WHERE id = $1
     RETURNING id, full_name, email, phone_number, photo_url`,
    [id, fullName ?? null, phoneNumber ?? null, photoUrl ?? null]
  );
  return rows[0] || null;
};

const getPasswordHash = async (id) => {
  const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [id]);
  return rows[0] ? rows[0].password_hash : null;
};

const updatePassword = async (id, passwordHash) => {
  await pool.query('UPDATE users SET password_hash = $2 WHERE id = $1', [id, passwordHash]);
};

module.exports = { createUser, findByEmail, findById, updateProfile, getPasswordHash, updatePassword };
