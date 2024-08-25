'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const comments = [];
    for (let i = 1; i <= 20; i++) {
      comments.push({
        content: `This is comment number ${i}`,
        productId: Math.floor(Math.random() * 20) + 1,
        userId: Math.floor(Math.random() * 20) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('comments', comments, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('comments', null, {});
  }
};
