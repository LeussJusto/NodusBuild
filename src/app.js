const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');

const app = express();
const path = require('path');

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));


app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);


// servir la carpeta uploads como pública
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling
app.use(errorHandler);

module.exports = app;