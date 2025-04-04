'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StatusUpdate extends Model {
    static associate(models) {
      // Relasi dengan Report
      StatusUpdate.belongsTo(models.Report, { 
        foreignKey: 'report_id',
        as: 'report' 
      });
      
      // Relasi dengan User
      StatusUpdate.belongsTo(models.User, { 
        foreignKey: 'updated_by',
        as: 'updater' 
      });
    }
  }
  
  StatusUpdate.init({
    status_id: {
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
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    status: {
      type: DataTypes.ENUM('Cancel', 'Pending', 'On-Going', 'Completed'),
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'StatusUpdate',
    tableName: 'status_updates',
    timestamps: false
  });
  
  return StatusUpdate;
};