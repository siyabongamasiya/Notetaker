# NoteTaker App

Full-stack note-taking application built with **React Native/Expo** (frontend) and **Express.js + TypeScript** (backend).

## Project Structure

```
Notetaker/
├── frontend/                   # React Native/Expo app
│   ├── app/                   # File-based routing with expo-router
│   ├── components/            # Reusable UI components
│   ├── store/                 # Redux store (auth, notes slices)
│   ├── package.json
│   └── ...
│
├── backend/                   # Express.js TypeScript API
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # JWT auth, CORS, etc.
│   │   └── db.ts              # Prisma client
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── .env                   # Configuration (DB, JWT secret)
│   ├── package.json
│   └── ...
│
└── README.md                  # This file
```

## Tech Stack

### Frontend

- **React Native** + **Expo** — Mobile UI framework
- **Redux Toolkit** — State management (auth, notes)
- **expo-router** — File-based navigation
- **TypeScript** — Type safety

### Backend

- **Express.js** — REST API framework
- **TypeScript** — Type safety
- **Prisma** — ORM for PostgreSQL
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **PostgreSQL** (via Neon) — Database

## Quick Start

### Prerequisites

- Node.js v18+
- npm or yarn
- PostgreSQL database (Neon URL provided in `.env`)

### Setup

#### Backend Setup

```bash
cd backend
npm install
npm run build
npm start
```

Backend runs on `http://localhost:4000`

#### Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

## API Endpoints

### Authentication

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user
- `GET /api/auth/profile` — Get user profile (protected)
- `PUT /api/auth/profile` — Update profile (protected)

### Notes

- `POST /api/notes` — Create note (protected)
- `GET /api/notes` — Get all user's notes (protected)
- `GET /api/notes/:id` — Get note by ID (protected)
- `PUT /api/notes/:id` — Update note (protected)
- `DELETE /api/notes/:id` — Delete note (protected)
- `GET /api/notes/category/:category` — Get notes by category (protected)
- `GET /api/notes/search?query=...` — Search notes (protected)

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://...  # Neon PostgreSQL connection
JWT_SECRET=your-secret-key     # JWT signing key (change in production!)
PORT=4000
NODE_ENV=development
```

## Database Schema

### User

- `id` (cuid) — Primary key
- `email` — Unique email address
- `username` — Unique username
- `password` — Hashed password
- `createdAt`, `updatedAt` — Timestamps

### Note

- `id` (cuid) — Primary key
- `title` — Note title
- `content` — Note content
- `category` — Category (work/study/personal)
- `userId` — Foreign key to User
- `createdAt`, `updatedAt` — Timestamps

## Next Steps

1. **Complete Prisma Integration** — Finalize schema validation and generate client properly
2. **Implement Full CRUD** — Wire services/controllers to Prisma client
3. **Test API Endpoints** — Use Postman or curl to validate endpoints
4. **Connect Frontend to Backend** — Update Redux and API service layer with real endpoints
5. **Add Unit Tests** — Jest/Vitest for backend and frontend
6. **Deploy** — Vercel (frontend), Railway/Heroku (backend)

## Development

### Frontend (in `frontend/` folder)

```bash
npm run dev      # Start Expo dev server
npm run build    # Build for production
```

### Backend (in `backend/` folder)

```bash
npm run dev      # Start with nodemon (hot reload)
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled server
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:migrate   # Run migrations
```

## Architecture

### Backend Structure (Service/Controller/Routes)

**Routes** → **Controllers** → **Services** → **Database**

- **Routes** (`routes/*.ts`): Define HTTP endpoints
- **Controllers** (`controllers/*.ts`): Parse requests, call services, return responses
- **Services** (`services/*.ts`): Implement business logic, database queries
- **Middleware** (`middleware/*.ts`): JWT authentication, error handling

### Frontend Architecture

- **Redux Store** (`store/slices/*.ts`): Centralized auth & notes state
- **Screens** (`app/*.tsx`): Page components with file-based routing
- **Components** (`components/*.tsx`): Reusable UI elements
- **Hooks** (`hooks/*.ts`): Custom React Native hooks (color scheme, theme)

## License

MIT
