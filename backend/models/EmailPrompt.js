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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  }
});

// Template relationship
EmailPrompt.belongsTo(EmailTemplate, { foreignKey: 'templateId', as: 'template' });
EmailTemplate.hasMany(EmailPrompt, { foreignKey: 'templateId' });

// User relationship
EmailPrompt.belongsTo(require('./User'), { foreignKey: 'userId', as: 'user' });

module.exports = EmailPrompt;
