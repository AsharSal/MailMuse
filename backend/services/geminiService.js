const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function generateEmail(prompt, tone = 'formal', template = 'general') {
//   const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const fullPrompt = `
  Compose a ${tone} email for the following context using a ${template} template:
  ${prompt}
  `;

//   const result = await model.generateContent(fullPrompt);
//   const response = await result.response;
//   return response.text();

const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [fullPrompt],
  });

  return response.text;
}

module.exports = { generateEmail };
