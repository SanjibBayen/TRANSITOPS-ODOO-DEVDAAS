<div align="center">

# TransitOps - Smart Transport Operations Platform

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Cloud-DC382D?style=flat-square&logo=redis&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage-3448C5?style=flat-square&logo=cloudinary&logoColor=white)

**Enterprise-Grade Fleet Management & Transport Operations Platform**

[Features](#-features) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Docs](#-api-documentation) • [Deployment](#-deployment)

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Deployment](#-deployment)
- [Testing](#-testing)


---

## Overview

**TransitOps** is a centralized, enterprise-grade transport operations platform designed to digitize the complete lifecycle of fleet management. Built for logistics companies struggling with manual processes, TransitOps provides real-time visibility, automated workflows, and actionable insights across vehicle registration, driver management, dispatch operations, maintenance tracking, and financial analytics.

---

## Features

### Authentication & Authorization
- **JWT-based Authentication** via Supabase Auth
- **Role-Based Access Control (RBAC)** with 4 distinct roles:
  - `FLEET_MANAGER` - Full fleet oversight
  - `DRIVER` - Trip management & fuel logging
  - `SAFETY_OFFICER` - Compliance & license tracking
  - `FINANCIAL_ANALYST` - Cost analysis & reporting
- **Row-Level Security (RLS)** on all database tables
- **Rate Limiting** on authentication endpoints
- **Session Management** with refresh tokens

### Vehicle Fleet Management
- Complete vehicle registry with unique registration numbers
- Real-time status tracking (Available, On Trip, In Shop, Retired)
- Load capacity validation on trip dispatch
- Odometer tracking with automatic updates
- Document management (RC, Insurance, Permit, Pollution)
- Bulk CSV import for fleet onboarding
- Advanced filtering & search capabilities

### Driver Management
- Comprehensive driver profiles with license verification
- License expiry tracking with 7-day advance alerts
- Safety score monitoring (0-100 scale)
- Status management (Available, On Trip, Off Duty, Suspended)
- Automatic status transitions based on trip assignments
- Driver performance analytics

### Trip & Dispatch Management
- **Drag-and-Drop Dispatch Board** (Kanban-style)
- Complete trip lifecycle: Draft → Dispatched → In Progress → Completed → Cancelled
- **State Machine** for valid trip transitions
- Automatic vehicle & driver status updates
- Cargo weight validation against vehicle capacity
- Real-time WebSocket updates for fleet managers
- Google Maps integration with route visualization

### Maintenance Management
- Maintenance record creation with automatic vehicle status change
- Service history tracking per vehicle
- Maintenance completion workflow
- Cost tracking for repairs & services
- Scheduled maintenance alerts based on odometer readings

### Fuel & Expense Tracking
- Fuel log recording with auto-calculated price per liter
- Expense categorization (Fuel, Toll, Maintenance, Permit, Insurance, Other)
- Per-vehicle & per-trip cost analysis
- Receipt upload via Cloudinary
- Fuel efficiency calculations (km/liter)

### Analytics & Reporting
- **Real-time KPI Dashboard** with sparkline charts
- Fleet utilization percentage calculation
- Vehicle ROI computation: `(Revenue - Costs) / Acquisition Cost × 100`
- Cost breakdown analysis (Fuel vs Maintenance vs Other)
- CSV & PDF export for all reports
- Role-specific dashboard views

### Notifications & Alerts
- In-app notification center
- Email notifications via Resend
- License expiry alerts (7-day & 30-day warnings)
- Maintenance due reminders
- Trip dispatch & completion notifications
- Real-time WebSocket push notifications

##  User Experience

### Professional Interface
- Clean, enterprise-grade design
- Consistent typography with system fonts
- Micro-interactions and smooth transitions
- Breadcrumb navigation for deep pages
- Collapsible sidebar with icon+text mode

### Dark Mode
- Full dark mode support across all pages
- TailwindCSS `dark:` class implementation
- System preference detection
- Manual toggle in header
- Persistent preference via localStorage
- All charts, tables, and forms dark-mode compatible

### Document Management
- Upload vehicle documents (RC, Insurance, Permits, Pollution)
- Cloudinary-powered secure file storage
- Document verification workflow (Pending → Verified)
- Expiry date tracking with visual alerts
- Document preview and download
- Bulk upload support
- Safety Officer verification system

### Responsive Design
- Mobile-first approach
- Optimized for 320px to 4K displays
- Touch-friendly targets on mobile
- Adaptive tables (horizontal scroll on mobile)
- Collapsible sidebar on small screens
- Bottom navigation bar for mobile

### Loading & Feedback States
- Skeleton loaders matching content layout
- Toast notifications (Sonner) for all actions
- Success, Error, Warning, Info variants
- Loading spinners during API calls
- Empty states with guided action buttons
- Error boundaries with retry options
- Optimistic UI updates for instant feedback

### Advanced Data Tables
- Search across all columns
- Multi-column filtering
- Status-based color coding
- Sortable columns
- Pagination controls
- Row hover actions
- Bulk selection support
- Export to CSV/PDF

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
│  React 18 + TypeScript + Redux Toolkit + TailwindCSS        │
│  Vite Dev Server (Port 5173)                                │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/WebSocket
┌──────────────────────▼──────────────────────────────────────┐
│                     API LAYER                               │
│  Express.js + TypeScript (Port 5000)                        │
│  ├── Authentication Middleware (JWT)                        │
│  ├── RBAC Middleware (Role-Based)                           │
│  ├── Rate Limiter Middleware                                │
│  ├── Security Middleware (Helmet, CORS, XSS)                │
│  ├── Validation Middleware (Zod)                            │
│  └── Audit Logging Middleware                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   SERVICE LAYER                             │
│  ├── Auth Service (Supabase Auth)                           │
│  ├── Vehicle Service                                        │
│  ├── Driver Service                                         │
│  ├── Trip Service (State Machine)                           │
│  ├── Dispatch Service (Validator)                           │
│  ├── Maintenance Service                                    │
│  ├── Fuel & Expense Service                                 │
│  ├── Analytics Service                                      │
│  ├── Notification Service                                   │
│  ├── Email Service (Resend)                                 │
│  ├── Export Service (CSV/PDF)                               │
│  └── Scheduler Service (Cron Jobs)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  DATA LAYER                                 │
│  ├── PostgreSQL (Supabase Cloud)                            │
│  │   ├── Row Level Security (RLS)                           │
│  │   ├── Stored Procedures & Triggers                       │
│  │   └── Materialized Views for Analytics                   │
│  ├── Redis Cloud (Caching & Rate Limiting)                  │
│  └── Cloudinary (Document & Image Storage)                  │
└─────────────────────────────────────────────────────────────┘

Real-time Layer:
  Socket.io Server ↔ Redis Pub/Sub ↔ Socket.io Client
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| TypeScript | 5.3 | Type Safety |
| Vite | 5.x | Build Tool |
| Redux Toolkit | 2.x | State Management |
| TailwindCSS | 3.x | Styling |
| Recharts | 2.x | Charts & Graphs |
| @hello-pangea/dnd | 16.x | Drag & Drop |
| React Router | 6.x | Routing |
| Sonner | 1.x | Toast Notifications |
| Lucide React | Latest | Icons |
| Google Maps | 3.x | Maps & Routes |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20 LTS | Runtime |
| Express.js | 4.x | HTTP Framework |
| TypeScript | 5.3 | Type Safety |
| Supabase JS | 2.x | Database & Auth Client |
| Socket.io | 4.x | WebSocket Server |
| Zod | 3.x | Schema Validation |
| PDFKit | Latest | PDF Generation |
| Multer | 1.x | File Upload |

### Infrastructure
| Service | Provider | Purpose |
|---------|----------|---------|
| PostgreSQL | Supabase Cloud | Primary Database |
| Redis | Redis Cloud | Caching & Sessions |
| Cloudinary | Cloudinary | File Storage |
| Resend | Resend | Email Service |
| Docker | Self-hosted | Containerization |

---

## Project Structure

```
transitops/
├── services/
│   ├── client/                    # React Frontend
│   │   ├── src/
│   │   │   ├── components/        # UI Components
│   │   │   │   ├── features/      # Feature Components
│   │   │   │   │   ├── auth/      # Authentication
│   │   │   │   │   ├── dashboard/ # Dashboards
│   │   │   │   │   ├── vehicles/  # Vehicle Management
│   │   │   │   │   ├── drivers/   # Driver Management
│   │   │   │   │   ├── dispatch/  # Dispatch Board
│   │   │   │   │   ├── trips/     # Trip Management
│   │   │   │   │   ├── maintenance/
│   │   │   │   │   ├── fuel/      # Fuel Logs
│   │   │   │   │   ├── expenses/  # Expense Tracking
│   │   │   │   │   ├── documents/ # Document Management
│   │   │   │   │   └── reports/   # Analytics & Reports
│   │   │   │   ├── layout/        # Layout Components
│   │   │   │   └── shared/        # Shared Components
│   │   │   ├── hooks/             # Custom React Hooks
│   │   │   ├── store/             # Redux Store
│   │   │   │   └── slices/        # Redux Slices
│   │   │   ├── lib/               # Library Configs
│   │   │   ├── config/            # App Configuration
│   │   │   ├── utils/             # Utility Functions
│   │   │   ├── types/             # TypeScript Types
│   │   │   └── styles/            # Global Styles
│   │   └── package.json
│   │
│   └── server/                    # Express Backend
│       ├── src/
│       │   ├── config/            # Configuration Files
│       │   │   ├── supabase.ts    # Database Client
│       │   │   ├── redis.ts       # Cache Client
│       │   │   ├── cloudinary.ts  # Storage Client
│       │   │   ├── email.ts       # Email Service
│       │   │   └── socket.ts      # WebSocket Server
│       │   ├── middleware/        # Express Middleware
│       │   │   ├── auth.ts        # JWT Authentication
│       │   │   ├── rbac.ts        # Role-Based Access
│       │   │   ├── security.ts    # Security Headers
│       │   │   ├── rateLimiter.ts # Rate Limiting
│       │   │   ├── cache.ts       # Redis Caching
│       │   │   ├── upload.ts      # File Upload
│       │   │   └── audit.ts       # Audit Logging
│       │   ├── modules/           # Feature Modules
│       │   │   ├── auth/          # Authentication
│       │   │   ├── users/         # User Management
│       │   │   ├── vehicles/      # Vehicle CRUD
│       │   │   ├── drivers/       # Driver CRUD
│       │   │   ├── trips/         # Trip Management
│       │   │   ├── dispatch/      # Dispatch Logic
│       │   │   ├── maintenance/   # Maintenance
│       │   │   ├── fuel/          # Fuel Tracking
│       │   │   ├── expenses/      # Expense Tracking
│       │   │   ├── documents/     # Document Management
│       │   │   └── analytics/     # Reports & KPIs
│       │   ├── services/          # Business Services
│       │   ├── utils/             # Utility Functions
│       │   └── types/             # Type Definitions
│       └── package.json
│
├── docker/                        # Docker Configuration
│   ├── backend/
│   ├── frontend/
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
│
├── supabase/                      # Database Migrations
│   ├── migrations/
│   └── seed.sql
│
├── scripts/                       # Utility Scripts
├── .env.example                   # Environment Template
└── README.md                      # Documentation
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Docker** (optional, for containerized deployment)
- **Supabase Account** (free tier works)
- **Cloudinary Account** (free tier: 25GB)
- **Resend Account** (free tier: 100 emails/day)
- **Redis Cloud Account** (free tier: 30MB)

### Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/transitops.git
cd transitops

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# 3. Install backend dependencies
cd services/server
npm install
cp .env.example .env
# Edit .env with your Supabase, Cloudinary, Resend keys

# 4. Install frontend dependencies
cd ../client
npm install
cp .env.example .env
# Edit .env with API URLs

# 5. Set up database
# Go to Supabase SQL Editor and run:
# - supabase/migrations/001_initial_schema.sql
# - supabase/seed.sql

# 6. Start backend (Terminal 1)
cd ../server
npm run dev
# Server running on http://localhost:5000

# 7. Start frontend (Terminal 2)
cd ../client
npm run dev
# Frontend running on http://localhost:5173

# 8. Open browser
# http://localhost:5173
```

### Docker Setup

```bash
# Development
docker-compose -f docker/docker-compose.yml up --build

# Production
docker-compose -f docker/docker-compose.prod.yml up --build -d

# Stop
docker-compose -f docker/docker-compose.yml down
```

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Fleet Manager | `john.fleet@transitops.com` | `Test@123` |
| Driver | `alex.driver@transitops.com` | `Test@123` |
| Safety Officer | `mike.safety@transitops.com` | `Test@123` |
| Financial Analyst | `emma.finance@transitops.com` | `Test@123` |

---

## Environment Variables

### Backend (`services/server/.env`)

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Resend Email
RESEND_API_KEY=your-resend-key

# Redis
REDIS_URL=redis://default:password@host:port
```

### Frontend (`services/client/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_WS_URL=ws://localhost:5000
```

---

## API Documentation

### Base URL: `http://localhost:5000/api/v1`

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/login` | Login & get token | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user | Yes |

### Vehicles

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/vehicles` | List all vehicles | Any |
| GET | `/vehicles/available` | Available vehicles | Any |
| GET | `/vehicles/stats` | Vehicle statistics | Any |
| GET | `/vehicles/:id` | Get vehicle detail | Any |
| POST | `/vehicles` | Create vehicle | FLEET_MANAGER |
| PUT | `/vehicles/:id` | Update vehicle | FLEET_MANAGER |
| PATCH | `/vehicles/:id/status` | Update status | FLEET_MANAGER |
| POST | `/vehicles/bulk-import` | CSV import | FLEET_MANAGER |

### Drivers

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/drivers` | List all drivers | Any |
| GET | `/drivers/available` | Available drivers | Any |
| GET | `/drivers/expiring-licenses` | Expiring licenses | FLEET_MANAGER, SAFETY_OFFICER |
| GET | `/drivers/:id` | Get driver detail | Any |
| POST | `/drivers` | Create driver | FLEET_MANAGER |
| PUT | `/drivers/:id` | Update driver | FLEET_MANAGER |
| PATCH | `/drivers/:id/status` | Update status | FLEET_MANAGER |

### Trips

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/trips` | List all trips | Any |
| GET | `/trips/:id` | Get trip detail | Any |
| POST | `/trips` | Create trip | FLEET_MANAGER |
| PATCH | `/trips/:id/status` | Update status | Any |
| PATCH | `/trips/:id/complete` | Complete trip | DRIVER |

### Dispatch

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/dispatch/available-resources` | Available vehicles & drivers | FLEET_MANAGER |
| POST | `/dispatch/validate` | Validate dispatch | FLEET_MANAGER |
| POST | `/dispatch/dispatch/:tripId` | Dispatch trip | FLEET_MANAGER |

### Maintenance

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/maintenance` | List all records | Any |
| GET | `/maintenance/active` | Active maintenance | Any |
| POST | `/maintenance` | Create record | FLEET_MANAGER |
| PATCH | `/maintenance/:id/complete` | Complete maintenance | FLEET_MANAGER |

### Fuel & Expenses

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/fuel` | List fuel logs | Any |
| POST | `/fuel` | Create fuel log | DRIVER, FLEET_MANAGER |
| GET | `/expenses` | List expenses | Any |
| POST | `/expenses` | Create expense | FLEET_MANAGER |

### Analytics

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/analytics/dashboard` | Dashboard KPIs | Any |
| GET | `/analytics/fleet-utilization` | Fleet utilization | Any |
| GET | `/analytics/vehicle-costs` | Cost analysis | FINANCIAL_ANALYST |
| GET | `/analytics/vehicle-roi` | Vehicle ROI | FINANCIAL_ANALYST |
| GET | `/analytics/export/vehicles/pdf` | Export vehicles PDF | FLEET_MANAGER |
| GET | `/analytics/export/trips/pdf` | Export trips PDF | FLEET_MANAGER |

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐
│   vehicles   │       │   drivers    │
├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │
│ reg_number   │       │ name         │
│ model        │       │ license_no   │
│ type         │       │ license_exp  │
│ capacity     │       │ safety_score │
│ odometer     │       │ status       │
│ status       │       │ user_id (FK) │
└──────┬───────┘       └──────┬───────┘
       │                      │
       │    ┌──────────┐      │
       └────┤  trips   ├──────┘
            ├──────────┤
            │ id (PK)  │
            │ trip_no   │
            │ source    │
            │ dest      │
            │ cargo_kg  │
            │ status    │
            │ vehicle_id│
            │ driver_id │
            └────┬─────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼───┐  ┌────▼────┐  ┌────▼────┐
│ fuel  │  │expenses │  │  maint  │
│ logs  │  │         │  │ enance  │
└───────┘  └─────────┘  └─────────┘
```

### Key Tables
- `vehicles` - Fleet asset registry
- `drivers` - Driver profiles with license tracking
- `trips` - Trip management with state machine
- `maintenances` - Maintenance records
- `fuel_logs` - Fuel consumption tracking
- `expenses` - Expense management
- `vehicle_documents` - Document storage
- `notifications` - In-app notifications
- `audit_logs` - Activity tracking

---

## Security

### Implemented Security Measures

| Layer | Implementation |
|-------|---------------|
| **Authentication** | JWT via Supabase Auth |
| **Authorization** | Role-Based Access Control (4 roles) |
| **Database** | Row Level Security (RLS) on all tables |
| **API** | Rate limiting (in-memory + Redis) |
| **Headers** | Helmet.js security headers |
| **CORS** | Whitelist-based origin validation |
| **XSS** | Input sanitization middleware |
| **SQL Injection** | Parameterized queries + input validation |
| **File Upload** | Type validation + size limits |
| **Audit** | All state changes logged |

---

## Deployment

### Option 1: Docker (Recommended)

```bash
# Build and run production containers
docker-compose -f docker/docker-compose.prod.yml up --build -d

# Frontend: http://localhost (Port 80)
# Backend: http://localhost:5000
```

### Option 2: Manual Deployment

```bash
# Backend
cd services/server
npm run build
npm start

# Frontend
cd services/client
npm run build
# Serve dist/ folder with nginx or similar
```


## Testing

### Backend API Tests

```bash
# Health check
curl http://localhost:5000/api/health

# Login test
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.fleet@transitops.com","password":"Test@123"}'

# Get vehicles with token
curl http://localhost:5000/api/v1/vehicles \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Tests

```bash
cd services/client
npm run build  # Verify build succeeds
```

---


<div align="center">

**Built with ❤️ by the DEVDAAS Team**

</div>
