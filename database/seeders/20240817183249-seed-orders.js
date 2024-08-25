'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orders = [];
    for (let i = 1; i <= 20; i++) {
      orders.push({
        status: 'processed',
        isPaid: Math.random() < 0.5,
        userId: Math.floor(Math.random() * 20) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('orders', orders, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('orders', null, {});
  }
};
