'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    
    return queryInterface.bulkInsert('users', [{
      name: 'Admin PAM',
      email: 'admin@pam.com',
      password: hashedPassword,
      phone: '08123456789',
      role: 'Admin',
      created_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { email: 'admin@pam.com' });
  }
};