import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables FIRST, before importing anything that reads them
dotenv.config();

import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/projects.routes';
import taskRoutes from './routes/tasks.routes';
import userRoutes from './routes/users.routes';
import { AppDataSource } from './config/ormconfig';

const app = express();
const PORT = process.env.PORT || 3001;

// HTTP server
const httpServer = createServer(app);

// Allowed origins: comma-separated list in CORS_ORIGIN, or fallback
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Make io accessible to our routes
app.set('io', io);

// Middleware
app.use(helmet({
  // Allow the app to serve its own frontend
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check endpoint (no auth required)
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'DeltaX API',
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);

// Root API info
app.get('/api/v1/', (_req, res) => {
  res.json({
    message: 'Welcome to DeltaX API',
    version: '1.0.0',
  });
});

// Serve static frontend files (single-service Railway deployment)
// At runtime: __dirname = /app/dist  →  ../web/dist = /app/web/dist
app.use(express.static(path.join(__dirname, '../web/dist')));

// Catch-all: serve the React SPA index.html for any unrecognised route
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../web/dist/index.html'));
});

// 404 handler (will only be reached for routes not matched above)
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_project_room', (projectId: string) => {
    socket.join(projectId);
    console.log(`Socket ${socket.id} joined project room: ${projectId}`);
  });

  socket.on('leave_project_room', (projectId: string) => {
    socket.leave(projectId);
    console.log(`Socket ${socket.id} left project room: ${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Initialize database THEN start listening
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });

export default app;