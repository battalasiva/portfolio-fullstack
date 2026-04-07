const { GoogleGenAI } = require('@google/genai');
const { fetchFullPortfolio } = require('./portfolioService');

class AIService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  // Build context string from portfolio data
  buildContext(data) {
    const { profile, skills, experiences, projects, contact } = data;

    if (!profile) {
      return 'Portfolio data is currently unavailable.';
    }

    return `
You are an AI assistant for a portfolio website.

PERSONAL INFO:
- Name: ${profile.name}
- Title: ${profile.title}
- Summary: ${profile.summary}
- Location: ${profile.location || 'Not available'}

SKILLS:
${
  skills.length
    ? skills.map((s) => `- ${s.category}: ${s.name} (${s.proficiency})`).join('\n')
    : 'No skills listed'
}

EXPERIENCE:
${
  experiences.length
    ? experiences
        .map(
          (exp) =>
            `- ${exp.role} at ${exp.company}${exp.isCurrent ? ' (Current)' : ''}\n  ${exp.description || ''}`
        )
        .join('\n')
    : 'No experience listed'
}

PROJECTS:
${
  projects.length
    ? projects
        .map(
          (p) =>
            `- ${p.title}${p.subtitle ? ` (${p.subtitle})` : ''}\n  ${p.description}\n  Tech: ${p.technologies}`
        )
        .join('\n')
    : 'No projects available'
}

CONTACT:
- Email: ${contact?.email || 'Not available'}
- Phone: ${contact?.phone || 'Not available'}
- Location: ${contact?.address || 'Not available'}
- Social Links: ${
      contact?.socialLinks?.length
        ? contact.socialLinks.map((l) => `${l.platform}: ${l.url}`).join(', ')
        : 'Not available'
    }

RULES:
- Answer ONLY using the provided portfolio data
- Do NOT make up information
- Be professional, friendly, and concise
- If data not available, politely say so
- Encourage contacting via provided contact details
`;
  }

  async chat(userMessage, userId) {
    try {
      const data = await fetchFullPortfolio(userId);
      const context = this.buildContext(data);

      const prompt = `${context}\n\nUser Question:\n${userMessage}\n\nProvide a clear and professional answer:`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
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
