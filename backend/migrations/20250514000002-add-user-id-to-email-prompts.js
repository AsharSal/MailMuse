'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First add the column as nullable
    await queryInterface.addColumn('EmailPrompts', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Create a default user for existing prompts if needed
    const [defaultUser] = await queryInterface.sequelize.query(`
      INSERT INTO Users (name, email, password, monthlyQuota, usedQuota, quotaResetDate, createdAt, updatedAt)
      VALUES ('System User', 'system@example.com', 'not-a-real-password', 999999, 0, NOW(), NOW(), NOW())
    `);

    // Update existing prompts to use the default user
    await queryInterface.sequelize.query(`
      UPDATE EmailPrompts SET userId = (SELECT id FROM Users WHERE email = 'system@example.com')
      WHERE userId IS NULL
    `);

    // Now make the column non-nullable
    await queryInterface.changeColumn('EmailPrompts', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('EmailPrompts', 'userId');
    await queryInterface.sequelize.query(`
      DELETE FROM Users WHERE email = 'system@example.com'
    `);
  }
};