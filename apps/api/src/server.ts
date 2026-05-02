import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/leads.routes';
import leadActivityRoutes from './routes/leadActivities.routes';
import automationRuleRoutes from './routes/automationRules.routes';
import { AppDataSource } from './config/ormconfig';

// Load environment variables
dotenv.config();

// Initialize database
AppDataSource.initialize()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

const app = express();
const PORT = process.env.PORT || 3001;

// HTTP server
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.VITE_API_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Make io accessible to our routes
app.set('io', io);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'LeadFlow Pro API'
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/lead-activities', leadActivityRoutes);
app.use('/api/v1/automation-rules', automationRuleRoutes);

// Basic route
app.get('/api/v1/', (req, res) => {
  res.json({ 
    message: 'Welcome to LeadFlow Pro API',
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a lead room to receive updates for a specific lead
  socket.on('join_lead_room', (leadId: string) => {
    socket.join(leadId);
    console.log(`Socket ${socket.id} joined lead room: ${leadId}`);
  });

  // Leave a lead room
  socket.on('leave_lead_room', (leadId: string) => {
    socket.leave(leadId);
    console.log(`Socket ${socket.id} left lead room: ${leadId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;