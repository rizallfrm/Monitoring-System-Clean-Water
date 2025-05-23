'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relasi dengan Report
      User.hasMany(models.Report, { 
        foreignKey: 'user_id',
        as: 'reports' 
      });
      
      // Relasi dengan Action (sebagai performer)
      User.hasMany(models.Action, { 
        foreignKey: 'performed_by',
        as: 'actions' 
      });
      
      // Relasi dengan StatusUpdate
      User.hasMany(models.StatusUpdate, { 
        foreignKey: 'updated_by',
        as: 'statusUpdates' 
      });
    }
    
    // Method untuk memeriksa password
    async checkPassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }
  
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('Warga', 'Petugas', 'Admin'),
      allowNull: false,
      defaultValue: 'Warga'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });
  
  return User;
};