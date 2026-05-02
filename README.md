# LeadFlow Pro

A real-time collaborative Lead Management System for HSR Motors car dealership, built with React, Node.js, Express, and PostgreSQL.

## Features

- **Multi-user Support**: Separate workflows for Sales Agents and Business Managers
- **Lead Management**: Create, track, and manage customer leads
- **Real-time Updates**: Live lead status updates via Socket.io
- **Visual Automation**: Drag-and-drop automation rule builder using @xyflow/react
- **Analytics Dashboard**: Track lead performance and conversion metrics

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (build tool)
- Redux Toolkit (state management)
- Material-UI v9 (component library)
- @xyflow/react (visual automation builder)
- Socket.io-client (real-time communication)
- Recharts (data visualization)

### Backend
- Node.js + Express
- TypeScript
- TypeORM (ORM)
- PostgreSQL (database)
- Socket.io (real-time server)
- JWT (authentication)

## Project Structure

```
DeltaX/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Express backend
├── packages/
│   └── shared/       # Shared types and utilities
├── infra/            # Infrastructure code
├── docs/             # Documentation
└── docker-compose.yml # Local development environment
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (optional if using Docker)

### Local Development with Docker

```bash
# Start all services (PostgreSQL, Redis, API, Web)
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Manual Setup

#### Backend

```bash
cd apps/api
npm install

# Create .env file
cp .env.example .env

# Run migrations
npm run migration:run

# Start development server
npm run dev
```

#### Frontend

```bash
cd apps/web
npm install
npm run dev
```

## Environment Variables

### Backend (.env)

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/deltax
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Leads
- `GET /api/v1/leads` - List leads (with pagination and filters)
- `POST /api/v1/leads` - Create lead
- `GET /api/v1/leads/:id` - Get lead details
- `PUT /api/v1/leads/:id` - Update lead
- `DELETE /api/v1/leads/:id` - Delete lead

### Lead Activities
- `GET /api/v1/leads/:id/activities` - Get lead activities
- `POST /api/v1/leads/:id/activities` - Create activity

### Automation Rules
- `GET /api/v1/automation-rules` - List rules
- `POST /api/v1/automation-rules` - Create rule
- `PUT /api/v1/automation-rules/:id` - Update rule
- `DELETE /api/v1/automation-rules/:id` - Delete rule

## Running Tests

### Frontend Tests

```bash
cd apps/web
npm test
```

### Backend Tests

```bash
cd apps/api
npm test
```

## Building for Production

### Frontend

```bash
cd apps/web
npm run build
```

The build output will be in `dist/`

### Backend

```bash
cd apps/api
npm run build
```

## Docker

Build and run using Docker Compose:

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d
```

## License

ISC