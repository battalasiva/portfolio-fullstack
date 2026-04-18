# Software Requirements Specification (SRS)

## Portfolio Builder Platform — Multi-Tenant CMS

**Project Name:** Portfolio Builder Platform
**Version:** 2.0
**Date:** June 2025
**Author:** Sivaram
**Tech Stack:** React.js, Node.js/Express.js, MongoDB, JWT Authentication

---

## 1. Introduction

### 1.1 Purpose

This document defines the complete software requirements for transforming the existing single-user personal portfolio into a **Multi-Tenant Portfolio Builder Platform**. The platform allows multiple users to sign up, build their portfolio through a private dashboard, and share a public portfolio link accessible without authentication.

### 1.2 Current System Overview

The existing system is a single-user MERN portfolio with:

- Single Portfolio document (name, title, bio, skills, resumeUrl, profileImage)
- Projects collection (title, subtitle, description, technologies, image, links, featured, status)
- Contact collection (phone, email, address, socialLinks) + ContactMessage collection
- AI Chat feature (Gemini integration)
- No authentication — all data is globally accessible
- No user model — data is not linked to any user

### 1.3 Target System Overview

A multi-tenant platform where:

- Multiple users can register and manage their own portfolio
- Each user gets a unique public URL: `/u/:username`
- Public visitors can view any user's portfolio without login
- Only authenticated users can create/edit/delete their own data
- Users can generate and download their resume as PDF

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React)                  │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Public   │  │   Auth       │  │   Dashboard   │  │
│  │  View     │  │  (Login/     │  │   (Private)   │  │
│  │ /u/:user  │  │   Signup)    │  │   /dashboard  │  │
│  └────┬─────┘  └──────┬───────┘  └───────┬───────┘  │
│       │               │                  │           │
│       └───────────────┼──────────────────┘           │
│                       │                              │
└───────────────────────┼──────────────────────────────┘
                        │ HTTP (Axios)
┌───────────────────────┼──────────────────────────────┐
│                 BACKEND (Node/Express)                │
│                       │                              │
│  ┌────────────────────┼────────────────────────┐     │
│  │              API Routes                     │     │
│  │                                             │     │
│  │  PUBLIC (No Auth)     PRIVATE (JWT Auth)    │     │
│  │  GET /api/u/:user     POST /api/projects    │     │
│  │  POST /api/auth/*     PUT /api/portfolio    │     │
│  │  POST /api/contact    DELETE /api/projects  │     │
│  │    /messages          GET /api/dashboard    │     │
│  └─────────────────────────────────────────────┘     │
│                       │                              │
│              ┌────────┴────────┐                     │
│              │   Middleware    │                     │
│              │  JWT Auth       │                     │
│              │  Ownership Check│                     │
│              └────────┬────────┘                     │
└───────────────────────┼──────────────────────────────┘
                        │
┌───────────────────────┼──────────────────────────────┐
│                  MongoDB                             │
│  ┌────────┐ ┌──────────┐ ┌─────────┐ ┌───────────┐  │
│  │ Users  │ │Portfolio │ │Projects │ │ Contacts  │  │
│  └────────┘ └──────────┘ └─────────┘ └───────────┘  │
└──────────────────────────────────────────────────────┘
```

### 2.2 Route Structure

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page / Platform homepage |
| `/login` | Public | User login |
| `/signup` | Public | User registration |
| `/u/:username` | Public | Public portfolio view (read-only) |
| `/dashboard` | Private (JWT) | User's admin panel |
| `/dashboard/portfolio` | Private (JWT) | Edit portfolio info |
| `/dashboard/projects` | Private (JWT) | Manage projects |
| `/dashboard/contact` | Private (JWT) | Edit contact info |
| `/dashboard/messages` | Private (JWT) | View received messages |
| `/dashboard/resume` | Private (JWT) | Preview & download resume PDF |

---

## 3. Database Schema

### 3.1 User Collection

```javascript
{
  _id: ObjectId,
  username: String,       // unique, lowercase, alphanumeric + hyphens, used in public URL
  email: String,          // unique
  password: String,       // bcrypt hashed
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `username` (unique), `email` (unique)

### 3.2 Portfolio Collection (Updated)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // ref: 'User' — NEW FIELD
  name: String,
  title: String,
  bio_one: String,
  bio_two: String,
  bio_three: String,
  skills: [{
    category: String,
    technologies: [String]
  }],
  resumeUrl: String,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Index:** `userId` (unique — one portfolio per user)

### 3.3 Project Collection (Updated)

```javascript
{
  _id: ObjectId,
  ownerId: ObjectId,      // ref: 'User' — NEW FIELD
  title: String,
  subtitle: String,
  description: String,
  technologies: String,
  image: String,
  links: {
    androidLink: String,
    iosLink: String,
    sourceLink: String,
    projectLink: String
  },
  featured: Boolean,
  status: String,         // 'active' | 'inactive' | 'archived'
  isPublished: Boolean,   // NEW FIELD — controls public visibility
  createdAt: Date,
  updatedAt: Date
}
```

**Index:** `ownerId`

### 3.4 Contact Collection (Updated)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // ref: 'User' — NEW FIELD
  phone: String,
  email: String,
  address: String,
  socialLinks: [{
    platform: String,
    url: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Index:** `userId` (unique — one contact per user)

### 3.5 ContactMessage Collection (Updated)

```javascript
{
  _id: ObjectId,
  recipientId: ObjectId,  // ref: 'User' — NEW FIELD (who receives the message)
  name: String,
  email: String,
  subject: String,
  message: String,
  isRead: Boolean,
  status: String,         // 'new' | 'read' | 'replied' | 'archived'
  createdAt: Date,
  updatedAt: Date
}
```

**Index:** `recipientId`

---

## 4. API Specification

### 4.1 Authentication APIs (Public — No Auth Required)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current logged-in user (requires JWT) |

**POST /api/auth/signup**

Request:
```json
{
  "username": "rahul",
  "email": "rahul@example.com",
  "password": "securePassword123"
}
```

Response (201):
```json
{
  "success": true,
  "token": "<jwt_token>",
  "data": { "_id": "...", "username": "rahul", "email": "rahul@example.com" }
}
```

Validations:
- `username`: required, unique, 3-30 chars, lowercase alphanumeric + hyphens only, no spaces
- `email`: required, unique, valid email format
- `password`: required, min 6 characters

**POST /api/auth/login**

Request:
```json
{
  "email": "rahul@example.com",
  "password": "securePassword123"
}
```

Response (200):
```json
{
  "success": true,
  "token": "<jwt_token>",
  "data": { "_id": "...", "username": "rahul", "email": "rahul@example.com" }
}
```

### 4.2 Public Portfolio APIs (No Auth Required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/u/:username` | Get complete public portfolio data for a user |
| POST | `/api/u/:username/messages` | Send a contact message to a user |

**GET /api/u/:username**

Returns combined portfolio + published projects + contact info for the given username.

Response (200):
```json
{
  "success": true,
  "data": {
    "user": { "username": "rahul" },
    "portfolio": { "name": "...", "title": "...", "bio_one": "...", "skills": [...] },
    "projects": [{ "title": "...", "isPublished": true, ... }],
    "contact": { "email": "...", "socialLinks": [...] }
  }
}
```

Notes:
- Only returns projects where `isPublished: true` and `status: 'active'`
- Returns 404 if username does not exist

**POST /api/u/:username/messages**

Request:
```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "subject": "Inquiry",
  "message": "Hello, I liked your portfolio!"
}
```

Notes:
- Automatically sets `recipientId` based on the username in the URL

### 4.3 Private Dashboard APIs (JWT Auth Required)

All endpoints below require `Authorization: Bearer <jwt_token>` header.
All endpoints automatically scope data to the logged-in user (extracted from JWT).

#### Portfolio Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/portfolio` | Get logged-in user's portfolio |
| POST | `/api/dashboard/portfolio` | Create portfolio (one per user) |
| PUT | `/api/dashboard/portfolio` | Update portfolio |

#### Project Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/projects` | Get all projects of logged-in user |
| POST | `/api/dashboard/projects` | Create new project |
| PUT | `/api/dashboard/projects/:id` | Update a project (ownership verified) |
| DELETE | `/api/dashboard/projects/:id` | Delete a project (ownership verified) |
| PATCH | `/api/dashboard/projects/:id/publish` | Toggle `isPublished` status |

#### Contact Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/contact` | Get logged-in user's contact info |
| POST | `/api/dashboard/contact` | Create contact info (one per user) |
| PUT | `/api/dashboard/contact` | Update contact info |

#### Messages Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/messages` | Get all messages received by logged-in user |
| GET | `/api/dashboard/messages/:id` | Get single message (ownership verified) |
| PUT | `/api/dashboard/messages/:id` | Update message status (ownership verified) |
| DELETE | `/api/dashboard/messages/:id` | Delete message (ownership verified) |

#### Image Upload

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/dashboard/upload` | Upload image (JWT required) |

### 4.4 AI Chat API (Existing)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | AI chat (keep existing, optionally scope to user) |

---

## 5. Authentication & Security

### 5.1 JWT Authentication Flow

1. User signs up or logs in → server returns a JWT token
2. Client stores JWT in `localStorage`
3. Client sends JWT in `Authorization: Bearer <token>` header for all private API calls
4. Server middleware verifies JWT and attaches `req.user = { id, username }` to the request
5. Token expires after 7 days (`JWT_EXPIRE=7d`)

### 5.2 Auth Middleware

```
authMiddleware(req, res, next):
  1. Extract token from Authorization header
  2. Verify token using JWT_SECRET
  3. Find user by decoded id
  4. Attach user to req.user
  5. Call next() or return 401
```

### 5.3 Ownership Verification

For every write/delete operation on projects, contact, messages:

```
ownershipCheck:
  1. Find the resource by ID
  2. Compare resource.ownerId (or userId/recipientId) with req.user.id
  3. If mismatch → return 403 Forbidden
  4. If match → proceed
```

### 5.4 Security Rules

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT secret stored in environment variable only
- Rate limiting on auth endpoints (stricter: 10 requests per 15 min)
- Rate limiting on general API (100 requests per 15 min)
- Input validation and sanitization on all endpoints
- Unique username check during signup (case-insensitive)
- CORS configured for allowed origins only
- Helmet.js for HTTP security headers

---

## 6. Frontend Specification

### 6.1 New Dependencies Required

| Package | Purpose |
|---|---|
| `react-router-dom` | Client-side routing |
| `jspdf` | PDF generation for resume |
| `html2canvas` | Convert HTML to canvas for PDF |

### 6.2 Page Components

#### 6.2.1 Landing Page (`/`)

- Platform introduction
- "Sign Up" and "Login" buttons
- Brief showcase of what the platform does

#### 6.2.2 Signup Page (`/signup`)

- Form fields: username, email, password, confirm password
- Real-time username availability check (debounced API call)
- Username format validation (lowercase, alphanumeric, hyphens)
- Redirect to `/dashboard` on success

#### 6.2.3 Login Page (`/login`)

- Form fields: email, password
- Error display for invalid credentials
- Redirect to `/dashboard` on success

#### 6.2.4 Public Portfolio View (`/u/:username`)

- Fetches data from `GET /api/u/:username`
- Displays: Hero section, About/Bio, Skills, Published Projects, Contact info
- Contact form that sends message via `POST /api/u/:username/messages`
- Loading shimmer/skeleton while data is being fetched
- 404 page if username not found
- No login required — fully public and read-only
- "Download Resume" button (generates PDF from displayed data)

#### 6.2.5 Dashboard Layout (`/dashboard/*`)

- Protected route — redirects to `/login` if no valid JWT
- Sidebar navigation: Portfolio, Projects, Contact, Messages, Resume, Logout
- Top bar showing logged-in username and public link (`/u/:username`)

#### 6.2.6 Dashboard — Portfolio Edit (`/dashboard/portfolio`)

- Form to create/edit: name, title, bio (3 paragraphs), skills, profile image
- Save button → calls POST or PUT `/api/dashboard/portfolio`

#### 6.2.7 Dashboard — Projects (`/dashboard/projects`)

- List of all user's projects with edit/delete/publish toggle
- "Add New Project" button → form with: title, subtitle, description, technologies, image upload, links
- Each project card shows `isPublished` toggle switch
- Publish/unpublish → calls PATCH `/api/dashboard/projects/:id/publish`

#### 6.2.8 Dashboard — Contact (`/dashboard/contact`)

- Form to create/edit: phone, email, address, social links
- Dynamic add/remove for social links

#### 6.2.9 Dashboard — Messages (`/dashboard/messages`)

- List of received contact messages
- Mark as read/replied
- Delete messages
- Filter by status (new, read, replied, archived)

#### 6.2.10 Dashboard — Resume (`/dashboard/resume`)

- Preview resume template populated with user's portfolio data
- "Download as PDF" button
- Uses `jspdf` + `html2canvas` to convert the HTML template to PDF

### 6.3 State Management (Redux Toolkit)

#### Existing Slices (to be updated)

- `portfolioSlice` — add user scoping
- `projectsSlice` — add user scoping, publish toggle
- `contactSlice` — add user scoping

#### New Slices

- `authSlice` — login, signup, logout, token management, current user
- `messagesSlice` — CRUD for contact messages
- `publicPortfolioSlice` — fetching public portfolio data for `/u/:username`

### 6.4 Route Protection

```jsx
<PrivateRoute>
  // Checks if JWT exists and is valid
  // If not → redirect to /login
  // If yes → render children
</PrivateRoute>
```

---

## 7. Resume PDF Generation

### 7.1 Flow

1. User navigates to `/dashboard/resume`
2. Frontend fetches user's portfolio data (name, title, bio, skills, projects, contact)
3. Data is rendered into a hidden HTML "resume template" element
4. On "Download PDF" click:
   - `html2canvas` captures the HTML element as a canvas image
   - `jspdf` creates a PDF document and adds the canvas image
   - PDF is downloaded to the user's device

### 7.2 Resume Template Content

- Name and Title
- Bio / Professional Summary
- Skills (grouped by category)
- Projects (title, description, technologies, links)
- Contact Information (email, phone, social links)

---

## 8. Migration Plan (Existing Data)

Since the current system has no `userId` on existing documents:

1. Create the User model and auth system first
2. Add `userId`/`ownerId` fields to existing models (not required initially for backward compat)
3. Create a one-time migration script to:
   - Create a default admin user
   - Assign all existing Portfolio, Project, Contact documents to that user
4. After migration, enforce `userId`/`ownerId` as required on all new documents

---

## 9. Folder Structure (Updated)

```
my-portfolio-fullstack/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   ├── Signup.js
│   │   │   │   └── PrivateRoute.js
│   │   │   ├── Dashboard/
│   │   │   │   ├── DashboardLayout.js
│   │   │   │   ├── Sidebar.js
│   │   │   │   ├── PortfolioEdit.js
│   │   │   │   ├── ProjectsManager.js
│   │   │   │   ├── ContactEdit.js
│   │   │   │   ├── MessagesInbox.js
│   │   │   │   └── ResumePreview.js
│   │   │   ├── Landing/
│   │   │   │   └── LandingPage.js
│   │   │   ├── PublicPortfolio/
│   │   │   │   ├── PublicView.js
│   │   │   │   ├── PublicHero.js
│   │   │   │   ├── PublicAbout.js
│   │   │   │   ├── PublicProjects.js
│   │   │   │   ├── PublicContact.js
│   │   │   │   └── PublicFooter.js
│   │   │   ├── common/
│   │   │   │   ├── Loader.js
│   │   │   │   ├── Shimmer.js
│   │   │   │   └── NotFound.js
│   │   │   └── ... (existing components for reference)
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── portfolioSlice.js
│   │   │   │   ├── projectsSlice.js
│   │   │   │   ├── contactSlice.js
│   │   │   │   ├── messagesSlice.js
│   │   │   │   └── publicPortfolioSlice.js
│   │   │   └── store.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── apiService.js
│   │   ├── utils/
│   │   │   └── resumeGenerator.js
│   │   ├── styles/
│   │   │   └── GlobalStyles.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   └── publicController.js
│   ├── middleware/
│   │   ├── auth.js              (JWT verification middleware)
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   ├── upload.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Portfolio.js
│   │   ├── Project.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── public.js
│   │   └── chat.js
│   ├── services/
│   │   └── aiService.js
│   ├── scripts/
│   │   └── migrateData.js
│   ├── uploads/
│   ├── utils/
│   │   ├── constants.js
│   │   ├── fileHelper.js
│   │   └── responseHelper.js
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── SRS.md
├── .gitignore
└── README.md
```

---

## 10. Environment Variables (Updated)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/portfolio-platform

# JWT
JWT_SECRET=<your_secret_key>
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<email>
EMAIL_PASS=<app_password>
```

---

## 11. Non-Functional Requirements

| Requirement | Specification |
|---|---|
| Performance | Public portfolio page loads in < 2 seconds |
| Security | Passwords bcrypt hashed, JWT auth, ownership checks on all mutations |
| Scalability | MongoDB indexes on userId/ownerId for efficient queries |
| Availability | Deployable on Render / Vercel / Railway |
| Browser Support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| Responsive | Mobile-first design, works on all screen sizes |
| Accessibility | Semantic HTML, ARIA labels, keyboard navigation |

---

## 12. Development Phases

### Phase 1 — Authentication & User Model

- Create User model
- Build signup/login APIs with JWT
- Build auth middleware
- Build Login/Signup pages on frontend
- Set up PrivateRoute component

### Phase 2 — Schema Migration & Dashboard APIs

- Add userId/ownerId to existing models
- Create dashboard API routes (CRUD for portfolio, projects, contact, messages)
- Add ownership verification middleware
- Write data migration script

### Phase 3 — Dashboard Frontend

- Build DashboardLayout with sidebar
- Build PortfolioEdit, ProjectsManager, ContactEdit, MessagesInbox pages
- Connect to dashboard APIs
- Add isPublished toggle for projects

### Phase 4 — Public Portfolio View

- Build public API endpoint `GET /api/u/:username`
- Build PublicView page with all sections
- Build public contact message form
- Add loading shimmer/skeleton

### Phase 5 — Resume PDF Generation

- Build ResumePreview component
- Integrate jspdf + html2canvas
- Add download functionality

### Phase 6 — Landing Page & Polish

- Build platform landing page
- Add username availability check on signup
- Performance optimization
- Final testing and deployment

---

## 13. Glossary

| Term | Definition |
|---|---|
| Multi-tenant | Multiple users share the same application, each with isolated data |
| JWT | JSON Web Token — stateless authentication mechanism |
| Public View | Portfolio page accessible without login via `/u/:username` |
| Dashboard | Private admin panel for managing portfolio data |
| Ownership Check | Server-side verification that the logged-in user owns the resource they are modifying |
| isPublished | Boolean flag on projects controlling whether they appear on the public portfolio |
