const EmailPrompt = require('../models/EmailPrompt');
const EmailTemplate = require('../models/EmailTemplate');
const { generateEmail } = require('../services/geminiService');

exports.getAllPrompts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const { count, rows: prompts } = await EmailPrompt.findAndCountAll({
      where: {
        userId: req.user.id // Only get prompts for current user
      },
      include: [
        {
          model: EmailTemplate,
          as: 'template',
          attributes: ['name', 'structure']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      success: true,
      data: prompts,
      pagination: {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        limit
      }
    });
  } catch (err) {
    console.error('Error fetching prompts:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

exports.composeEmail = async (req, res) => {
  const { prompt, tone, templateId } = req.body;

  try {
    // Check if user has exceeded quota
    if (req.user.usedQuota >= req.user.monthlyQuota) {
      return res.status(403).json({
        success: false,
        error: 'Monthly quota exceeded. Please try again next month.'
      });
    }

    let fullPrompt = prompt;
    let dbTemplateID = null;
    
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }
    if (!tone) {
      return res.status(400).json({ success: false, error: 'Tone is required' });
    }

    if(templateId) {
      const template = await EmailTemplate.findByPk(templateId);
      if(template) {
        dbTemplateID = template.id;
        fullPrompt = `
          You are an expert email writer. Use the following tone: ${tone}.
          
          Here is the template structure:
          ${template.structure}
          
          Now write an email based on:
          ${prompt}
        `;
      } else {
        fullPrompt = getBasePrompt(tone, prompt);
      }
    } else {
      fullPrompt = getBasePrompt(tone, prompt);
    }

    const generatedEmail = await generateEmail(fullPrompt);

    // Create prompt with user ID
    const savedPrompt = await EmailPrompt.create({ 
      prompt, 
      tone, 
      templateId: dbTemplateID, 
      generatedEmail,
      userId: req.user.id 
    });

    // Increment used quota
    req.user.usedQuota += 1;
    await req.user.save();

    res.json({
      success: true,
      data: {
        id: savedPrompt.id,
        generatedEmail,
        remainingQuota: req.user.monthlyQuota - req.user.usedQuota
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
