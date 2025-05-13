const EmailTemplate = require('../models/EmailTemplate');

exports.createTemplate = async (req, res) => {
  const { name, description, structure } = req.body;
  try {
    const template = await EmailTemplate.create({ name, description, structure });
    res.status(201).json({ success: true, data: template });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Could not create template' });
  }
};

exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.findAll();
    res.json({ success: true, data: templates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Could not fetch templates' });
  }
};
