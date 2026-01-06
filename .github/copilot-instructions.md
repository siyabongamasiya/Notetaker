# NoteTaker Copilot Instructions

## Architecture Overview

This is a **monorepo** with React Native frontend (Expo) + TypeScript backend (Express). Key structure:

- **Frontend**: `frontend/` - React Native app using Expo Router (file-based routing)
- **Backend**: `backend/` - Express REST API with TypeScript, PostgreSQL (via `pg` Pool), JWT auth
- **Root scripts**: Use `npm run dev` (runs both), `npm run start-backend`, or `npm run start-frontend`

## Critical Developer Workflows

### Development Commands

```bash
# Install all dependencies (uses npm workspaces)
npm run install-all

# Run both frontend + backend concurrently
npm run dev

# Run separately
npm run start-backend   # Backend on :4000
npm run start-frontend  # Expo dev server

# Backend only
cd backend && npm run dev  # Uses nodemon + ts-node
```

### Database Setup

- Uses **PostgreSQL** with `pg` Pool (no ORM/Prisma despite file names)
- Connection via `DATABASE_URL` in `.env` (with SSL for production)
- Schema: `User` table (id, email, username, password) and `Note` table (id, userId, title, content, category, createdAt, updatedAt)
- Raw SQL queries in service layer (see `backend/src/services/*.ts`)

### Deployment

- Backend: Deployed to **Render** (free tier) at `https://notetaker-backend-hko9.onrender.com`
- Frontend: Built as APK via Expo EAS Build (see `frontend/eas.json`)
- **Note**: Free tier may cause cold starts/delays on first request

## State Management Pattern

### Redux Toolkit + Async Thunks

All API calls use Redux Toolkit's `createAsyncThunk` pattern:

```typescript
// Example from frontend/store/slices/notesSlice.ts
export const createNote = createAsyncThunk(
  "notes/createNote",
  async ({ title, content, category }, { rejectWithValue }) => {
    try {
      const res = await api.post("/notes", { title, content, category });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed");
    }
  }
);
```

**Conventions:**

- Thunks handle errors with `rejectWithValue` - never throw
- Toast notifications (`react-native-toast-message`) in reducers for user feedback
- Centralized API client in `frontend/services/api.ts` with automatic token injection

## Backend Architecture

### Service Layer Pattern

Controllers delegate to services (no direct DB access in controllers):

- `AuthService` - User registration, login, profile retrieval
- `NotesService` - CRUD operations for notes with category filtering/search

**Example** from `backend/src/controllers/NoteController.ts`:

```typescript
async createNote(req: Request, res: Response) {
  const userId = (req as any).userId; // Set by authMiddleware
  const { title, content, category } = req.body;
  const note = await noteService.createNote(userId, title, content, category);
  return res.status(201).json(note);
}
```

### Authentication Flow

- JWT tokens stored in AsyncStorage (`frontend`)
- Axios interceptor auto-attaches `Authorization: Bearer <token>` header
- Backend middleware (`authMiddleware.ts`) validates token, extracts `userId`, attaches to `req`
- All `/api/notes/*` routes protected via `notesRouter.use(authMiddleware)`

## Frontend Navigation & Auth

### Expo Router File-Based Routing

- Entry point: `frontend/app/_layout.tsx`
- **AuthGate component**: Hydrates auth state from AsyncStorage on app start, routes to `/login` if no token
- Public routes: `""`, `"index"`, `"login"`, `"register"` (defined in `PUBLIC_ROUTES` set)
- Protected routes auto-redirect to login if `user === null`

**Key files:**

- `app/index.tsx` - Landing/splash
- `app/login.tsx`, `app/register.tsx` - Auth screens
- `app/home.tsx` - Category overview (fetches notes by category on mount)
- `app/ViewNotes.tsx` - Filtered notes list
- `app/Add_Note.tsx`, `app/Edit_note.tsx` - Note forms

### Component Patterns

- **Reusable cards**: `NoteItemCard.tsx`, `CategoryCard.tsx`, `HomeTopCard.tsx`
- **Shared components**: `components/shared/Button.tsx`, `EditText.tsx` (custom styled inputs)
- **FAB pattern**: `AddNoteFab.tsx` for floating add button (used in ViewNotes)

## Project-Specific Conventions

### Note Categories

Three hardcoded categories (type union): `"Work" | "Study" | "Personal"`

- Defined in `frontend/store/slices/notesSlice.ts` and used throughout
- Backend allows `category` to be nullable but frontend always provides one

### Date Formatting

Use helper in `NoteItemCard.tsx`:

```typescript
const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};
```

### Error Handling

- Backend: Try-catch in controllers → `res.status(400).json({ error: message })`
- Frontend: Thunks use `rejectWithValue` → reducer shows Toast on error → UI reflects `error` state

### TypeScript Patterns

- Backend uses `(req as any).userId` after authMiddleware (no custom Request type extension)
- Frontend uses strict types for Note, User, Category
- Both use `any` for error catches (not ideal but consistent)

## API Endpoints Reference

### Auth (`/api/auth`)

- `POST /register` - { email, username, password } → { user, token }
- `POST /login` - { email, password } → { user, token }
- `GET /profile` - (requires Bearer token) → { user }

### Notes (`/api/notes`)

All require authentication:

- `POST /` - { title?, content, category } → Note
- `GET /` - Returns all user's notes (sorted by createdAt DESC)
- `GET /category/:category` - Filter by category
- `GET /search?q=...` - Full-text search
- `GET /:id` - Single note
- `PUT /:id` - { title?, content?, category? } → Updated note
- `DELETE /:id` - Soft/hard delete

## Debugging Tips

- **"Note not found" errors**: Check userId matching in SQL queries (userId is JWT claim, not URL param)
- **Token issues**: Check AsyncStorage state, verify `Authorization` header in axios interceptor logs
- **Cold starts**: Backend on Render free tier sleeps - first request may take 30s+
- **Navigation loops**: Check AuthGate logic in `_layout.tsx` - `hydrating` state must resolve before routing

## Design Assets

Figma designs stored in `frontend/assets/designs/` (see README.md for screenshots)
