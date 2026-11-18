const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'FinanceMate API',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealth };
