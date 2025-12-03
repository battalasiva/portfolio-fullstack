# Portfolio Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Database Setup Options

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. Database will be created automatically at: `mongodb://localhost:27017/portfolio`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://cloud.mongodb.com
2. Create new cluster
3. Get connection string
4. Update MONGODB_URI in .env file

### 3. Environment Configuration
1. Copy `.env.example` to `.env`
2. Update values as needed

### 4. Start Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Portfolio
- GET `/api/portfolio` - Get personal info
- PUT `/api/portfolio` - Update personal info

### Projects
- GET `/api/projects` - Get all projects
- GET `/api/projects/:id` - Get single project
- POST `/api/projects` - Create project
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

### Contact
- GET `/api/contact` - Get contact info
- PUT `/api/contact` - Update contact info
- POST `/api/contact/message` - Send message
- GET `/api/contact/messages` - Get all messages

### Health Check
- GET `/api/health` - Server status

## Testing API
Use Postman or curl to test endpoints:
```bash
curl http://localhost:5000/api/health
```