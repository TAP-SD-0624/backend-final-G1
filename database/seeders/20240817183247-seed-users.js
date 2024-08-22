'use strict';
const bcrypt = require('bcrypt');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    for (let i = 1; i <= 20; i++) {
      users.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        address: `Address ${i}`,
        password: bcrypt.hashSync(`password${i}`,10),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
