'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const discounts = [];
    for (let i = 1; i <= 20; i++) {
      discounts.push({
        discountRate: (Math.random() * 50).toFixed(2),
        productId: i,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('discounts', discounts, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('discounts', null, {});
  }
};
