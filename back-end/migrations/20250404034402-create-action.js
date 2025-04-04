'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('actions', {
      action_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      report_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'reports',
          key: 'report_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      performed_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      action_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      performed_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    
    // Menambahkan indeks untuk kolom yang sering dicari
    await queryInterface.addIndex('actions', ['report_id']);
    await queryInterface.addIndex('actions', ['performed_by']);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('actions');
  }
};