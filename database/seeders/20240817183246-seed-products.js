'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = [];
    for (let i = 1; i <= 20; i++) {
      products.push({
        name: `Product ${i}`,
        price: (i * 10) + 0.99,
        description: `Description for product ${i}`,
        stock: 100,
        brandId: Math.floor(Math.random() * 20) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('products', products, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('products', null, {});
  }
};
