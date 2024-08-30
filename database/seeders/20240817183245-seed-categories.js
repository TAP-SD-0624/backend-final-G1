'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define categories with appropriate names
    const categories = [
      { name: 'Shoes', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Shirts', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Watches', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Handbags', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sunglasses', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sportswear', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bags', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Accessories', createdAt: new Date(), updatedAt: new Date() },
    ];

    // Insert categories into the database
    await queryInterface.bulkInsert('categories', categories, {});

   
  },

  down: async (queryInterface, Sequelize) => {
    
    // Delete categories
    return queryInterface.bulkDelete('categories', null, {});
  }
};
