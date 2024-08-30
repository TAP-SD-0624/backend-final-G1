'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const brands = [
      { name: 'Nike', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Adidas', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Puma', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Under Armour', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Reebok', createdAt: new Date(), updatedAt: new Date() },
      { name: 'New Balance', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Asics', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Converse', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Vans', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Levi\'s', createdAt: new Date(), updatedAt: new Date() },
      { name: 'H&M', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Zara', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Gap', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tommy Hilfiger', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Calvin Klein', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Michael Kors', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ray-Ban', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Oakley', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fossil', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Seiko', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Rolex', createdAt: new Date(), updatedAt: new Date() }
    ];
    return queryInterface.bulkInsert('brands', brands, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('brands', null, {});
  }
};
