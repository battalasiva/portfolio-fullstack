# Postman API Testing Guide

## 🚀 Setup for Local Testing

### 1. Update Environment
✅ Already set to `NODE_ENV=development` in `.env`

### 2. Start Backend Server
```bash
cd server
npm start
```

Server should run on: `http://localhost:5000`

### 3. Verify Server Running
Open browser: `http://localhost:5000/api/health`

Expected Response:
```json
{
  "success": true,
  "message": "Portfolio API is running!",
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

---

## 📋 All API Endpoints for Postman

### Base URL
```
http://localhost:5000/api
```

---

## 1️⃣ PORTFOLIO ENDPOINTS

### GET Portfolio
```
Method: GET
URL: http://localhost:5000/api/portfolio

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Sivaram",
    "title": "Full Stack Developer",
    "bio_one": "...",
    "bio_two": "...",
    "bio_three": "...",
    "skills": [...],
    "resumeUrl": "..."
  }
}
```

### CREATE Portfolio
```
Method: POST
URL: http://localhost:5000/api/portfolio
Headers: Content-Type: application/json

Body (raw JSON):
{
  "name": "John Doe",
  "title": "Full Stack Developer",
  "bio_one": "First paragraph of bio",
  "bio_two": "Second paragraph of bio",
  "bio_three": "Third paragraph of bio",
  "resumeUrl": "https://example.com/resume.pdf",
  "skills": [
    {
      "category": "Frontend Development",
      "technologies": ["React", "Vue", "Angular"]
    },
    {
      "category": "Backend Development",
      "technologies": ["Node.js", "Express", "MongoDB"]
    }
  ]
}
```

### UPDATE Portfolio
```
Method: PUT
URL: http://localhost:5000/api/portfolio
Headers: Content-Type: application/json

Body (raw JSON):
{
  "name": "John Doe Updated",
  "title": "Senior Full Stack Developer",
  "bio_one": "Updated first paragraph",
  "bio_two": "Updated second paragraph",
  "bio_three": "Updated third paragraph",
  "resumeUrl": "https://example.com/resume-updated.pdf",
  "skills": [
    {
      "category": "Frontend Development",
      "technologies": ["React", "Next.js", "TypeScript"]
    }
  ]
}
```

---

## 2️⃣ PROJECTS ENDPOINTS

### GET All Projects
```
Method: GET
URL: http://localhost:5000/api/projects

Query Parameters (optional):
- status: active | inactive | archived
- featured: true | false
- limit: 10
- page: 1

Example: http://localhost:5000/api/projects?status=active&featured=true
```

### GET Single Project
```
Method: GET
URL: http://localhost:5000/api/projects/{projectId}

Example: http://localhost:5000/api/projects/65abc123def456789
```

### CREATE Project
```
Method: POST
URL: http://localhost:5000/api/projects
Headers: Content-Type: application/json

Body (raw JSON):
{
  "title": "E-Commerce Platform",
  "subtitle": "Full-featured online shopping application",
  "description": "A comprehensive e-commerce platform with user authentication, product management, shopping cart, and payment integration.",
  "technologies": "React, Node.js, MongoDB, Stripe",
  "image": "/uploads/project-1234567890-123456789.jpg",
  "links": {
    "androidLink": "",
    "iosLink": "",
    "sourceLink": "https://github.com/username/project",
    "projectLink": "https://demo.example.com"
  },
  "featured": true,
  "status": "active"
}
```

### UPDATE Project
```
Method: PUT
URL: http://localhost:5000/api/projects/{projectId}
Headers: Content-Type: application/json

Body (raw JSON):
{
  "title": "E-Commerce Platform Updated",
  "subtitle": "Updated subtitle",
  "description": "Updated description",
  "technologies": "React, Node.js, MongoDB, Stripe, Redis",
  "image": "/uploads/new-image.jpg",
  "links": {
    "androidLink": "",
    "iosLink": "",
    "sourceLink": "https://github.com/username/project",
    "projectLink": "https://demo.example.com"
  },
  "featured": false,
  "status": "active"
}
```

### DELETE Project
```
Method: DELETE
URL: http://localhost:5000/api/projects/{projectId}

Example: http://localhost:5000/api/projects/65abc123def456789

Response:
{
  "success": true,
  "message": "Project deleted successfully",
  "data": {...}
}
```

### UPLOAD Project Image
```
Method: POST
URL: http://localhost:5000/api/projects/upload
Headers: (Postman auto-sets for form-data)

Body (form-data):
Key: image
Type: File
Value: [Select image file]

Response:
{
  "success": true,
  "imageUrl": "/uploads/project-1234567890-123456789.jpg",
  "message": "Image uploaded successfully"
}
```

---

## 3️⃣ CONTACT ENDPOINTS

### GET Contact
```
Method: GET
URL: http://localhost:5000/api/contact

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "phone": "+91 1234567890",
    "email": "contact@example.com",
    "address": "City, State",
    "socialLinks": [...]
  }
}
```

### CREATE Contact
```
Method: POST
URL: http://localhost:5000/api/contact
Headers: Content-Type: application/json

Body (raw JSON):
{
  "phone": "+91 1234567890",
  "email": "contact@example.com",
  "address": "Hyderabad, Telangana",
  "socialLinks": [
    {
      "platform": "LinkedIn",
      "url": "https://linkedin.com/in/username"
    },
    {
      "platform": "GitHub",
      "url": "https://github.com/username"
    },
    {
      "platform": "Twitter",
      "url": "https://twitter.com/username"
    }
  ]
}
```

### UPDATE Contact
```
Method: PUT
URL: http://localhost:5000/api/contact
Headers: Content-Type: application/json

Body (raw JSON):
{
  "phone": "+91 9876543210",
  "email": "updated@example.com",
  "address": "Mumbai, Maharashtra",
  "socialLinks": [
    {
      "platform": "LinkedIn",
      "url": "https://linkedin.com/in/updated"
    }
  ]
}
```

---

## 4️⃣ AI CHAT ENDPOINT (FIXING 500 ERROR)

### Test Chat (Simple)
```
Method: POST
URL: http://localhost:5000/api/chat
Headers: Content-Type: application/json

Body (raw JSON):
{
  "message": "What are your skills?"
}

Expected Response:
{
  "success": true,
  "response": "Based on the portfolio, the key skills include...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Chat (With History)
```
Method: POST
URL: http://localhost:5000/api/chat
Headers: Content-Type: application/json

Body (raw JSON):
{
  "message": "Tell me more about the projects",
  "history": [
    {
      "role": "user",
      "parts": [{ "text": "What are your skills?" }]
    },
    {
      "role": "model",
      "parts": [{ "text": "I have skills in React, Node.js, and MongoDB." }]
    }
  ]
}
```

---

## 🐛 Troubleshooting Chat 500 Error

### Common Issues:

1. **Missing API Key**
   - Check `.env` has `GEMINI_API_KEY`
   - Verify key is valid

2. **No Portfolio Data**
   - Ensure portfolio exists in database
   - Test: GET http://localhost:5000/api/portfolio

3. **Invalid Request Format**
   - Ensure `message` field is string
   - Check Content-Type header

### Debug Steps:

1. **Check Server Logs**
   ```bash
   # Look for error messages in terminal
   ```

2. **Test Health Endpoint**
   ```
   GET http://localhost:5000/api/health
   ```

3. **Test Portfolio Endpoint**
   ```
   GET http://localhost:5000/api/portfolio
   ```

4. **Test Simple Chat**
   ```json
   POST http://localhost:5000/api/chat
   {
     "message": "Hello"
   }
   ```

5. **Check Gemini API Key**
   - Go to: https://makersuite.google.com/app/apikey
   - Verify key is active
   - Check quota limits

---

## 📊 Postman Collection Structure

```
Portfolio API
├── Health Check
├── Portfolio
│   ├── GET Portfolio
│   ├── POST Create Portfolio
│   └── PUT Update Portfolio
├── Projects
│   ├── GET All Projects
│   ├── GET Single Project
│   ├── POST Create Project
│   ├── PUT Update Project
│   ├── DELETE Project
│   └── POST Upload Image
├── Contact
│   ├── GET Contact
│   ├── POST Create Contact
│   └── PUT Update Contact
└── AI Chat
    ├── POST Simple Chat
    └── POST Chat with History
```

---

## 🔧 Environment Variables in Postman

Create Environment: `Portfolio Local`

Variables:
```
baseUrl: http://localhost:5000/api
projectId: [paste actual project ID after creating]
```

Usage in requests:
```
{{baseUrl}}/projects/{{projectId}}
```

---

## ✅ Testing Checklist

### Portfolio:
- [ ] GET portfolio
- [ ] POST create portfolio
- [ ] PUT update portfolio

### Projects:
- [ ] GET all projects
- [ ] GET single project
- [ ] POST upload image
- [ ] POST create project (with uploaded image URL)
- [ ] PUT update project
- [ ] DELETE project

### Contact:
- [ ] GET contact
- [ ] POST create contact
- [ ] PUT update contact

### AI Chat:
- [ ] POST simple message
- [ ] POST with conversation history
- [ ] Verify response contains portfolio data

---

## 🎯 Quick Test Sequence

1. **Health Check**
   ```
   GET /api/health
   ```

2. **Create Portfolio** (if not exists)
   ```
   POST /api/portfolio
   ```

3. **Upload Image**
   ```
   POST /api/projects/upload
   ```

4. **Create Project** (use image URL from step 3)
   ```
   POST /api/projects
   ```

5. **Test Chat**
   ```
   POST /api/chat
   Body: { "message": "What projects do you have?" }
   ```

---

## 📝 Sample Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error details"
}
```

---

## 🚀 Ready to Test!

1. Start server: `cd server && npm start`
2. Open Postman
3. Import endpoints from this guide
4. Start testing!

For chat 500 error, check:
- Server logs for specific error
- Gemini API key validity
- Portfolio data exists in database
