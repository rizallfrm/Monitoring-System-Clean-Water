'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Action extends Model {
    static associate(models) {
      // Relasi dengan Report
      Action.belongsTo(models.Report, { 
        foreignKey: 'report_id',
        as: 'report' 
      });
      
      // Relasi dengan User
      Action.belongsTo(models.User, { 
        foreignKey: 'performed_by',
        as: 'performer' 
      });
    }
  }
  
  Action.init({
    action_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    report_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'reports',
        key: 'report_id'
      }
    },
    performed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    action_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    performed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Action',
    tableName: 'actions',
    timestamps: false
  });
  
  return Action;
};