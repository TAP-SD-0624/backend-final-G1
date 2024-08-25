'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [];
    for (let i = 1; i <= 20; i++) {
      categories.push({
        name: `Category ${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories', null, {});
  }
};
