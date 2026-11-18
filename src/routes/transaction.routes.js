const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const {
  createTransaction,
  getTransactions,
  getSummary,
} = require('../controllers/transaction.controller');

const router = express.Router();

router.use(authenticate);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/summary', getSummary);

module.exports = router;
