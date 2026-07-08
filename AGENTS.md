# AI Agent Guidelines for user-data-dashboard

This document helps AI coding agents understand the codebase structure, conventions, and workflows.

## Project Overview

A full-stack React + Express application for collecting and managing faculty profile details. The system has two roles:
- **Faculty Users**: Can create/update their own profile (stored in `/server/data/submissions.json`)
- **Backend/Admin Users**: Can view and update all faculty records

See [README.md](README.md) for detailed feature list and demo login credentials.

## Tech Stack

- **Frontend**: React 19 + Vite 6
- **Backend**: Express.js
- **Build Tool**: Vite with React plugin
- **Data Storage**: JSON files (no database)
- **Dev Server**: Concurrently (frontend + backend)
- **UI Icons**: lucide-react
- **HTTP**: CORS-enabled

## Build & Run Commands

```bash
# Install dependencies
npm install

# Development (runs frontend + backend concurrently)
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:4000

# Production build
npm run build

# Preview production build
npm run preview
```

## Architecture

### Frontend Structure
```
src/
├── main.jsx              # React app entry point, auth state management
├── api.js                # Shared API fetch wrapper (API_URL: http://localhost:4000/api)
├── styles.css            # Global styles
├── components/
│   ├── Shell.jsx         # Dashboard layout wrapper
│   ├── DashboardHeader.jsx # Dashboard heading
│   └── FacultyForm.jsx    # Complete faculty form (all 20+ fields)
├── pages/
│   ├── LoginScreen.jsx   # Login, registration, password update UI
│   ├── UserDashboard.jsx # Faculty user: form + save to backend
│   └── AdminDashboard.jsx # Admin: list + edit all records
├── data/
│   └── facultyForm.js    # Form field defaults (emptyForm object)
└── utils/
    └── experience.js     # Calculates KL University experience from joining date
```

### Backend Structure
```
server/
├── index.js              # Express app, all API routes
└── data/
    ├── users.json        # Demo users (6283/user123, 9999/admin123)
    ├── submissions.json  # Faculty profile records
    └── employeeIds.json  # Allowed employee IDs for registration
```

### Data Flow
1. **Login**: Employee ID + Password → `POST /api/login` → Bearer token stored
2. **Registration**: New user → `POST /api/register` → Validates against employeeIds.json
3. **Faculty Form**: User fills form → `PUT /api/submission` → Saved to submissions.json
4. **Admin Updates**: Admin edits record → `PUT /api/admin/submissions/:id` → Updated

### Auth & Sessions
- Token-based auth using `Authorization: Bearer <token>` header
- Sessions stored in-memory (server restarts lose sessions)
- Auth state in localStorage: `"dashboard-auth"` key contains user object + token
- Role-based routing: `auth.user.role` === `"user"` or `"admin"`

## Key Patterns & Conventions

### API Calls Pattern
Use the `apiFetch()` helper from `src/api.js`:
```javascript
import { apiFetch, API_URL } from "./api";

// With token
const result = await apiFetch("/endpoint", token, { 
  method: "POST", 
  body: JSON.stringify(data) 
});

// Without token (login/register)
const result = await apiFetch("/login", null, { 
  method: "POST", 
  body: JSON.stringify(credentials) 
});
```

### Form Structure
- All faculty form fields defined in `src/data/facultyForm.js` → `emptyForm` object
- Default values: `designation="Professor"`, `gender="Male"`, `category="OC"`, `country="INDIA"`
- Use `createEmptyForm()` to get fresh form instance

### Employee ID Validation
- Only Employee IDs in `server/data/employeeIds.json` can register
- Normalized by trimming and converting to string
- Duplicate registration check happens during registration

### Experience Calculation
- `src/utils/experience.js` exports function to calculate KL University years from joining date
- Used in form display; also calculated/stored in submissions

## Important Notes for Development

### File Structure
- **React files**: Use `.jsx` extension
- **Utility functions**: Use `.js` extension
- **CSS**: Single `src/styles.css` file (not component-scoped)

### Data Persistence
- Backend writes to JSON files synchronously
- No transaction/rollback support
- **Production note**: This is a demo. For production, use:
  - Hashed passwords (bcrypt)
  - Database-backed sessions (Redis, MongoDB, PostgreSQL)
  - Proper authentication (JWT, OAuth)

### Demo Data
Four Employee IDs pre-authorized: `6283`, `6620`, `3915`, `1001`, `1002`, `9999`

Only two demo users exist initially:
| Employee ID | Password | Role   |
|-------------|----------|--------|
| 6283        | user123  | user   |
| 9999        | admin123 | admin  |

New registrations create additional users if Employee ID is in allowlist.

### Localhost & Network
- Vite runs on `--host 0.0.0.0` (accessible from network)
- Backend CORS enabled for all origins
- Frontend API_URL hardcoded to `http://localhost:4000/api` (update for deployment)

### Common Issues
- Old backend still running on port 4000 → Kill process or use `npm run dev`
- Form shows old error messages → Likely running old backend code
- Auth state persists after logout → Check localStorage `"dashboard-auth"` cleared
- Cannot register known Employee ID → Check `server/data/employeeIds.json` for ID

## Quick Reference: API Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/login` | No | User + Admin login |
| POST | `/api/register` | No | New user registration |
| PUT | `/api/password` | Yes | Update password by Employee ID |
| POST | `/api/submission` | Yes | Create faculty profile |
| PUT | `/api/submission` | Yes | Update faculty profile |
| GET | `/api/submission` | Yes | Get user's submission |
| GET | `/api/submissions` | Yes (admin) | List all submissions (admin only) |
| PUT | `/api/admin/submissions/:id` | Yes (admin) | Update submission by ID (admin only) |

## Related Documentation

- See [README.md](README.md) for feature list, faculty form fields, and demo login instructions.
- Backend implementation details in `server/index.js`
- Form validation rules and defaults in `src/data/facultyForm.js`
