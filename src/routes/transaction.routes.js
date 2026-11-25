const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const {
  createTransaction,
  getTransactions,
  deleteTransaction,
  getSummary,
} = require('../controllers/transaction.controller');

const router = express.Router();

router.use(authenticate);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.delete('/:id', deleteTransaction);
router.get('/summary', getSummary);

module.exports = router;
