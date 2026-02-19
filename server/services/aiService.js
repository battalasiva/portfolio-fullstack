const { GoogleGenerativeAI } = require('@google/generative-ai');
const Portfolio = require('../models/Portfolio');
const Project = require('../models/Project');
const { Contact } = require('../models/Contact');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getPortfolioContext() {
    try {
      const portfolio = await Portfolio.findOne();
      const projects = await Project.find({ status: 'active' });
      const contact = await Contact.findOne();

      const context = `
You are an AI assistant for a portfolio website. Here is the information about the person:

PERSONAL INFO:
- Name: ${portfolio?.name || 'Not available'}
- Title: ${portfolio?.title || 'Not available'}
- Bio: ${portfolio?.bio_one || ''} ${portfolio?.bio_two || ''} ${portfolio?.bio_three || ''}

SKILLS:
${portfolio?.skills?.map(skill => `- ${skill.category}: ${skill.technologies.join(', ')}`).join('\n') || 'No skills listed'}

PROJECTS:
${projects?.map(project => `
- ${project.title} (${project.subtitle})
  Description: ${project.description}
  Technologies: ${project.technologies}
  Links: ${Object.entries(project.links || {}).filter(([_, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')}
`).join('\n') || 'No projects available'}

CONTACT:
- Email: ${contact?.email || 'Not available'}
- Phone: ${contact?.phone || 'Not available'}
- Location: ${contact?.address || 'Not available'}
- Social Links: ${contact?.socialLinks?.map(link => `${link.platform}: ${link.url}`).join(', ') || 'Not available'}

Instructions:
- Answer questions about this person's skills, experience, projects, and contact information
- Be professional, friendly, and concise
- If asked about something not in the data, politely say you don't have that information
- Encourage visitors to reach out via the contact information provided
- Don't make up information that isn't provided above
`;

      return context;
    } catch (error) {
      console.error('Error fetching portfolio context:', error);
      return 'Unable to fetch portfolio information at this time.';
    }
  }

  async chat(userMessage, conversationHistory = []) {
    try {
      const context = await this.getPortfolioContext();
      
      const chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: context }],
          },
          {
            role: 'model',
            parts: [{ text: 'I understand. I will answer questions about this portfolio based on the information provided.' }],
          },
          ...conversationHistory,
        ],
      });

      const result = await chat.sendMessage(userMessage);
      const response = result.response.text();

      return response;
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }
}

module.exports = new AIService();
