import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { autoSeedIfEmpty } from './prisma/seed.js';

const PORT = process.env.PORT || 5050;

const server = app.listen(PORT, async () => {
  console.log(`[CHRONOS Server] Horological engine listening on http://localhost:${PORT}`);
  // Ensure database has initial records if empty
  await autoSeedIfEmpty();
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
