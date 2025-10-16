const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const reportRoutes = require('./routes/reports');
const documentRoutes = require('./routes/documents');
const activityLogRoutes = require('./routes/activityLogs');
const notificationRoutes = require('./routes/notifications');
const chatMessageRoutes = require('./routes/chatMessages');


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
app.use('/api/', taskRoutes);
app.use('/api/', reportRoutes);
app.use('/api/', documentRoutes);
app.use('/api/', activityLogRoutes);
app.use('/api/', notificationRoutes);
app.use('/api/', chatMessageRoutes);


// servir la carpeta uploads como pública
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling
app.use(errorHandler);

module.exports = app;