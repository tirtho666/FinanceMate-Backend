const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');

const SALT_ROUNDS = 10;

const getProfile = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    return res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    // email is read-only and intentionally ignored here
    const { full_name, phone_number, photo_url } = req.body;

    const user = await userRepository.updateProfile(req.user.id, {
      fullName: full_name,
      phoneNumber: phone_number,
      photoUrl: photo_url,
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    return res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    return next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        status: 'error',
        message: 'current_password and new_password are required',
      });
    }

    const currentHash = await userRepository.getPasswordHash(req.user.id);
    if (!currentHash) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(current_password, currentHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect',
      });
    }

    const newPasswordHash = await bcrypt.hash(new_password, SALT_ROUNDS);
    await userRepository.updatePassword(req.user.id, newPasswordHash);

    return res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
