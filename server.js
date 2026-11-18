require('dotenv').config();

const express = require('express');
const cors = require('cors');

const routes = require('./src/routes');
const initDatabase = require('./src/config/initDb');
const { notFoundHandler, errorHandler } = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`FinanceMate API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database', err);
    process.exit(1);
  }
};

start();

module.exports = app;
