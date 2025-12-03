# Portfolio API Examples with Updated Bio Structure

## Create Portfolio (POST)

**URL:** `http://localhost:5000/api/portfolio`  
**Method:** `POST`  
**Headers:** `Content-Type: application/json`

### Sample Payload:
```json
{
  "name": "Sivaram Battala",
  "title": "Mobile App/Web Developer (Frontend)",
  "bio_one": "I am a passionate frontend developer with a strong background in Mobile app & Web development, specializing in Flutter and React Native. I have developed and deployed numerous mobile applications, successfully publishing them on both the Google Play Store and Apple App Store.",
  "bio_two": "My expertise lies in building high-performance, user-friendly, and scalable mobile applications that enhance user experience. In addition to mobile development, I have significant experience in web development using React.js, where I have built multiple projects with modern frontend frameworks.",
  "bio_three": "My skills extend to efficiently handling frontend architecture, optimizing performance, and integrating APIs to deliver seamless applications. I have also worked extensively on deployment processes, ensuring smooth production and development releases.",
  "skills": [
    {
      "category": "Mobile App Development",
      "technologies": ["Flutter", "React Native"]
    },
    {
      "category": "Web Development",
      "technologies": ["React js", "JavaScript", "HTML", "CSS", "Material UI"]
    },
    {
      "category": "Version Control & CI/CD",
      "technologies": ["Git", "GitHub"]
    },
    {
      "category": "State Management",
      "technologies": ["Redux", "Provider", "Bloc", "GetX"]
    },
    {
      "category": "Deployments",
      "technologies": ["Firebase", "Vercel", "Play Store", "App Store"]
    }
  ],
  "resumeUrl": "https://flowcv.com/resume/n2w7km0a2i",
  "profileImage": "/uploads/profile.jpg"
}
```

## Update Portfolio (PUT)

**URL:** `http://localhost:5000/api/portfolio`  
**Method:** `PUT`  
**Headers:** `Content-Type: application/json`

### Sample Payload (Partial Update):
```json
{
  "bio_one": "Updated first paragraph about my passion for development...",
  "bio_two": "Updated second paragraph about my expertise...",
  "title": "Senior Mobile App/Web Developer"
}
```

## Get Portfolio (GET)

**URL:** `http://localhost:5000/api/portfolio`  
**Method:** `GET`

### Expected Response:
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Sivaram Battala",
    "title": "Mobile App/Web Developer (Frontend)",
    "bio_one": "I am a passionate frontend developer...",
    "bio_two": "My expertise lies in building...",
    "bio_three": "My skills extend to efficiently...",
    "skills": [...],
    "resumeUrl": "https://flowcv.com/resume/n2w7km0a2i",
    "profileImage": "/uploads/profile.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Frontend Usage Example

### How to display the bio paragraphs in React:
```jsx
const About = ({ portfolioData }) => {
  return (
    <div className="about-description">
      <p>{portfolioData.bio_one}</p>
      <p>{portfolioData.bio_two}</p>
      <p>{portfolioData.bio_three}</p>
    </div>
  );
};
```

## Validation Errors

If any bio paragraph is missing, you'll get:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "First bio paragraph is required",
      "param": "bio_one",
      "location": "body"
    }
  ]
}
```