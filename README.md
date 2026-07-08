# User Data Dashboard

A full-stack ReactJS application for collecting faculty details, storing them as JSON on the backend, and managing records from separate faculty user and backend/admin dashboards.

## Features

- User login and backend/admin login
- Employee registration with allowed Employee ID verification
- Duplicate Employee ID registration prevention
- User password update by Employee ID and current password
- User dashboard for creating and updating faculty profile details
- Backend dashboard for viewing and updating all submitted records
- Data stored in `server/data/submissions.json`
- Demo users stored in `server/data/users.json`
- Allowed employee IDs stored in `server/data/employeeIds.json`
- Faculty form fields include employee ID, SSC name, designation, gender, category, DOB, qualification details, UG/PG/Ph.D study details, thesis status, domicile, joining date, experience, AADHAR, PAN, research level, country, and NET/SET/SLET details

## Demo Logins

Login uses Employee ID and password for both normal users and backend/admin users.

| Role | Employee ID | Password |
| --- | --- | --- |
| User | 6283 | user123 |
| Backend/Admin | 9999 | admin123 |

The app opens the dashboard based on the logged-in account role.

## Registration

Users can register with basic fields:

- Employee ID
- Name
- Email
- Password

The backend verifies the Employee ID against:

```text
server/data/employeeIds.json
```

If the Employee ID is not listed, registration is blocked. If the Employee ID is already registered in `server/data/users.json`, the app displays `Employee is already registered.`

## Run Locally

```bash
npm install
npm run dev
```

Open the React app at:

```text
http://localhost:5173
```

The backend API runs at:

```text
http://localhost:4000
```

## Storage

Submitted and updated data is saved as JSON here:

```text
server/data/submissions.json
```

When the faculty user clicks **Save to backend**, the React form sends the data to `PUT /api/submission`. The Express backend validates the required fields and writes the complete faculty record into this JSON file. Backend/admin updates use `PUT /api/admin/submissions/:id` and save to the same file.

## Frontend Components

- `src/main.jsx` starts the React app
- `src/api.js` contains backend API calls
- `src/data/facultyForm.js` contains the faculty form default values
- `src/utils/experience.js` calculates KL University experience from joining date
- `src/components/Shell.jsx` contains the dashboard layout
- `src/components/DashboardHeader.jsx` contains the dashboard heading
- `src/components/FacultyForm.jsx` contains the complete faculty form
- `src/pages/LoginScreen.jsx` contains login, registration, and password update UI
- `src/pages/UserDashboard.jsx` saves faculty form data to backend
- `src/pages/AdminDashboard.jsx` lists and updates backend records

If you see `Please enter full name, email, phone, department`, stop the old backend process and run `npm run dev` again from this updated folder. That message belongs to the older backend code.

This app is intended as a clear starter project. For production use, replace demo password checks with hashed passwords and use a database-backed session system.
