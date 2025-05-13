const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmailTemplate = sequelize.define('EmailTemplate', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  structure: {
    type: DataTypes.TEXT, // e.g. "Dear [Name],\n\n[Body]\n\nBest,\n[Your Name]"
    allowNull: false,
  }
});

module.exports = EmailTemplate;
