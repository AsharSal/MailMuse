const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const EmailTemplate = require('./EmailTemplate');

const EmailPrompt = sequelize.define('EmailPrompt', {
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tone: {
    type: DataTypes.STRING,
    defaultValue: 'formal',
  },
  generatedEmail: {
    type: DataTypes.TEXT,
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'EmailTemplates',
      key: 'id',
    },
  },
});

EmailPrompt.belongsTo(EmailTemplate, { foreignKey: 'templateId' });
EmailTemplate.hasMany(EmailPrompt, { foreignKey: 'templateId' });

module.exports = EmailPrompt;
