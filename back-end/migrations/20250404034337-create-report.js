"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("reports", {
      report_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
       images: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },

      status: {
        type: Sequelize.ENUM("Cancel", "Pending", "On-Going", "Completed"),
        allowNull: false,
        defaultValue: "Pending",
      },
      assigned_to: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Menambahkan indeks untuk kolom yang sering dicari
    await queryInterface.addIndex("reports", ["user_id"]);
    await queryInterface.addIndex("reports", ["assigned_to"]);
    await queryInterface.addIndex("reports", ["status"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("reports");
  },
};
