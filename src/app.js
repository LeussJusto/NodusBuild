const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// API routes
app.use('/api/auth', authRoutes);
// ... add more routes

// Error handling
app.use(errorHandler);

module.exports = app;