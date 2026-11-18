const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '30d';

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });

const signup = async (req, res, next) => {
  try {
    const { full_name, email, password, phone_number, photo_url } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'full_name, email and password are required',
      });
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email is already registered',
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await userRepository.createUser({
      fullName: full_name,
      email,
      passwordHash,
      phoneNumber: phone_number,
      photoUrl: photo_url,
    });

    return res.status(201).json({ status: 'success', data: { user } });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'email and password are required',
      });
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      status: 'success',
      data: { user: safeUser, token: signToken(user) },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { signup, login };
