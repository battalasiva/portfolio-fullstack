# Portfolio API Documentation

## Base URL: `http://localhost:5000/api`

## Response Format
All responses follow this structure:
```json
{
  "success": true/false,
  "data": {}, // For successful responses
  "message": "string", // For errors or info
  "pagination": {} // For paginated responses
}
```

## Portfolio Endpoints

### GET `/portfolio`
Get portfolio information
- **Response**: Portfolio object or 404 if not found

### POST `/portfolio`
Create portfolio information
- **Body**: Portfolio object (name, title, bio_one, bio_two, bio_three, skills, resumeUrl, profileImage)
- **Response**: Created portfolio object

### PUT `/portfolio`
Update portfolio information
- **Body**: Portfolio fields to update (name, title, bio_one, bio_two, bio_three, skills, resumeUrl, profileImage)
- **Response**: Updated portfolio object

### DELETE `/portfolio`
Delete portfolio information
- **Response**: Success message

## Projects Endpoints

### GET `/projects`
Get all projects with optional filtering
- **Query Params**:
  - `status`: active/inactive/archived
  - `featured`: true/false
  - `page`: page number (default: 1)
  - `limit`: items per page (default: 10)
- **Response**: Array of projects with pagination

### GET `/projects/:id`
Get single project by ID
- **Response**: Project object or 404

### POST `/projects`
Create new project
- **Body**: Project object (title, subtitle, description, technologies, image, links, featured, status)
- **Response**: Created project object

### PUT `/projects/:id`
Update project by ID
- **Body**: Project fields to update
- **Response**: Updated project object

### DELETE `/projects/:id`
Delete project by ID
- **Response**: Success message

## Contact Endpoints

### GET `/contact`
Get contact information
- **Response**: Contact object or 404

### POST `/contact`
Create contact information
- **Body**: Contact object (phone, email, address, socialLinks)
- **Response**: Created contact object

### PUT `/contact`
Update contact information
- **Body**: Contact fields to update
- **Response**: Updated contact object

### DELETE `/contact`
Delete contact information
- **Response**: Success message

## Contact Messages Endpoints

### GET `/contact/messages`
Get all contact messages with filtering
- **Query Params**:
  - `status`: new/read/replied/archived
  - `isRead`: true/false
  - `page`: page number (default: 1)
  - `limit`: items per page (default: 10)
- **Response**: Array of messages with pagination

### GET `/contact/messages/:id`
Get single message by ID
- **Response**: Message object or 404

### POST `/contact/messages`
Create new contact message
- **Body**: Message object (name, email, subject, message)
- **Response**: Created message object

### PUT `/contact/messages/:id`
Update message (mark as read, change status)
- **Body**: Message fields to update (isRead, status)
- **Response**: Updated message object

### DELETE `/contact/messages/:id`
Delete message by ID
- **Response**: Success message

## Error Codes
- **400**: Bad Request (validation errors, invalid data)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error