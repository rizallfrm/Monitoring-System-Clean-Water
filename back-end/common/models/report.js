"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      // Relasi dengan User
      Report.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "reporter",
      });

      // Relasi dengan StatusUpdate
      Report.hasMany(models.StatusUpdate, {
        foreignKey: "report_id",
        as: "statusUpdates",
      });

      // Relasi dengan Action
      Report.hasMany(models.Action, {
        foreignKey: "report_id",
        as: "actions",
      });

      // Relasi dengan User (assigned_to)
      Report.belongsTo(models.User, {
        foreignKey: "assigned_to",
        as: "assignedOfficer",
      });
    }
  }

  Report.init(
    {
      report_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Cancel", "Pending", "On-Going", "Completed"),
        allowNull: false,
        defaultValue: "Pending",
      },
      images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },

      assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Report",
      tableName: "reports",
      timestamps: false,
    }
  );

  return Report;
};
