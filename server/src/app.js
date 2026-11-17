import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import reminderRoutes from './routes/reminderRoutes.js';
import occurrenceRoutes from './routes/occurrenceRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import pushRoutes from './routes/pushRoutes.js';

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // allow 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'CHRONOS Backend Engine is Active',
    environment: process.env.NODE_ENV || 'development',
  });
});

// REST API Routes
app.use('/api/reminders', reminderRoutes);
app.use('/api/occurrences', occurrenceRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/push', pushRoutes);

// Centralized 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[CHRONOS Server Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : err.message,
  });
});

export default app;
