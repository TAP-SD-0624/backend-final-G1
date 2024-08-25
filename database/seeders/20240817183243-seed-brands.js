'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const brands = [];
    for (let i = 1; i <= 20; i++) {
      brands.push({
        name: `Brand ${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('brands', brands, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('brands', null, {});
  }
};
