const EmailPrompt = require('../models/EmailPrompt');
const EmailTemplate = require('../models/EmailTemplate');
const { generateEmail } = require('../services/geminiService');

exports.composeEmail = async (req, res) => {
  const { prompt, tone, templateId } = req.body;

  try {
    let fullPrompt = prompt;
    let dbTemplateID = null;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }
    if (!tone) {
      return res.status(400).json({ success: false, error: 'Tone is required' });
    }
    if(templateId){
        const template = await EmailTemplate.findByPk(templateId);
        if(template){
            dbTemplateID = template.id;
            fullPrompt = `
            You are an expert email writer. Use the following tone: ${tone}.
            
            Here is the template structure:
            ${template.structure}
            
            Now write an email based on:
            ${prompt}
            `;
        }
        else {
            fullPrompt = getBasePrompt(tone, prompt);
        }

    }
    else {
        fullPrompt = getBasePrompt(tone, prompt);
    }

    const generatedEmail = await generateEmail(fullPrompt);
    const savedPrompt = await EmailPrompt.create({ prompt, tone, templateId: dbTemplateID, generatedEmail });

    res.json({
      success: true,
      data: {
        id: savedPrompt.id,
        generatedEmail,
      },
    });
  } catch (err) {
    console.error('Error composing email:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

function getBasePrompt(tone, prompt) {
    return `
        You are an expert email writer. Use the following tone: ${tone}.
        
        Now write an email based on:
        ${prompt}
        `;
}
