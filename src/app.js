const express = require('express');
const bodyParser = require('express').json;
const logger = require('./logger');
const { loggingMiddleware, errorLoggingMiddleware } = require('./middleware/loggingMiddleware');

const app = express();
app.use(bodyParser());
app.use(loggingMiddleware);

const items = [
  { id: 1, name: 'Item Alpha' },
  { id: 2, name: 'Item Beta' }
];

app.get('/health', (req, res) => {
  logger.info('Health check endpoint called');
  res.json({ status: 'ok' });
});

app.get('/api/items', (req, res) => {
  logger.info('Fetching item list', { count: items.length });
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    logger.warn('Invalid create item payload', { body: req.body });
    return res.status(400).json({ error: 'Invalid item name' });
  }

  const newItem = {
    id: items.length + 1,
    name: name.trim()
  };
  items.push(newItem);
  logger.info('Created new item', { item: newItem });
  res.status(201).json(newItem);
});

app.use(errorLoggingMiddleware);

app.use((err, req, res, next) => {
  logger.error('Error handler responding to client', {
    message: err.message,
    stack: err.stack
  });
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
