import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[CHRONOS Server] Horological engine listening on http://localhost:${PORT}`);
});

// Graceful Shutdown
const shutdown = (signal) => {
  console.log(`[CHRONOS Server] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[CHRONOS Server] Process terminated.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
