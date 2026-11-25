const transactionRepository = require('../repositories/transaction.repository');

const VALID_TYPES = ['income', 'expense'];

const createTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, date, note } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({
        status: 'error',
        message: 'type, amount and category are required',
      });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        status: 'error',
        message: "type must be either 'income' or 'expense'",
      });
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'amount must be a positive number',
      });
    }

    const transaction = await transactionRepository.createTransaction({
      userId: req.user.id,
      type,
      amount: parsedAmount,
      category,
      date: date || null,
      note,
    });

    return res.status(201).json({ status: 'success', data: { transaction } });
  } catch (err) {
    return next(err);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const { month, category } = req.query;

    if (month && month !== 'this' && month !== 'last') {
      return res.status(400).json({
        status: 'error',
        message: "month must be either 'this' or 'last'",
      });
    }

    const transactions = await transactionRepository.findByUserId(req.user.id, {
      month,
      category,
    });

    return res.status(200).json({ status: 'success', data: { transactions } });
  } catch (err) {
    return next(err);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        status: 'error',
        message: 'A valid transaction id is required',
      });
    }

    const deleted = await transactionRepository.deleteTransaction(
      req.user.id,
      id
    );

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found',
      });
    }

    return res.status(200).json({ status: 'success', data: { id: deleted.id } });
  } catch (err) {
    return next(err);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const summary = await transactionRepository.getSummary(req.user.id);
    return res.status(200).json({ status: 'success', data: summary });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction,
  getSummary,
};
