const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const { getProfile, updateProfile, changePassword } = require('../controllers/user.controller');

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
