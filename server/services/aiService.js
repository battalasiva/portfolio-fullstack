const { GoogleGenAI } = require('@google/genai');
const Portfolio = require('../models/Portfolio');
const Project = require('../models/Project');
const { Contact } = require('../models/Contact');

class AIService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async getPortfolioContext() {
    try {
      const portfolio = await Portfolio.findOne();
      const projects = await Project.find({ status: 'active' });
      const contact = await Contact.findOne();

      if (!portfolio) {
        return "Portfolio data is currently unavailable.";
      }

      return `
You are an AI assistant for a portfolio website.

PERSONAL INFO:
- Name: ${portfolio?.name || 'Not available'}
- Title: ${portfolio?.title || 'Not available'}
- Bio: ${portfolio?.bio_one || ''} ${portfolio?.bio_two || ''} ${portfolio?.bio_three || ''}

SKILLS:
${portfolio?.skills?.length
          ? portfolio.skills
              .map(
                (skill) =>
                  `- ${skill.category}: ${skill.technologies.join(', ')}`
              )
              .join('\n')
          : 'No skills listed'}

PROJECTS:
${projects?.length
          ? projects
              .map(
                (project) => `
- ${project.title} (${project.subtitle || ''})
  Description: ${project.description}
  Technologies: ${project.technologies}
  Links: ${
    project.links
      ? Object.entries(project.links)
          .filter(([_, v]) => v)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')
      : 'No links available'
  }
`
              )
              .join('\n')
          : 'No projects available'}

CONTACT:
- Email: ${contact?.email || 'Not available'}
- Phone: ${contact?.phone || 'Not available'}
- Location: ${contact?.address || 'Not available'}
- Social Links: ${
        contact?.socialLinks?.length
          ? contact.socialLinks
              .map((link) => `${link.platform}: ${link.url}`)
              .join(', ')
          : 'Not available'
      }

RULES:
- Answer ONLY using the provided portfolio data
- Do NOT make up information
- Be professional, friendly, and concise
- If data not available, politely say so
- Encourage contacting via provided contact details
`;
    } catch (error) {
      console.error('Error building portfolio context:', error);
      return 'Portfolio information is temporarily unavailable.';
    }
  }

  async chat(userMessage) {
    try {
      const context = await this.getPortfolioContext();

      const prompt = `
${context}

User Question:
${userMessage}

Provide a clear and professional answer:
`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash', // Recommended free + fast model
        contents: prompt,
      });

      return response.text;

    } catch (error) {
      console.error('Gemini Error:', error);
      throw new Error('Failed to generate AI response.');
    }
  }
}

module.exports = new AIService();
