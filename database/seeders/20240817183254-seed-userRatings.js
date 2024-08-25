'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userRatings = [];
    for (let i = 1; i <= 20; i++) {
      userRatings.push({
        userId: Math.floor(Math.random() * 20) + 1,
        productId: Math.floor(Math.random() * 20) + 1,
        rating: (Math.random() * 5).toFixed(2),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('userRatings', userRatings, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('userRatings', null, {});
  }
};
