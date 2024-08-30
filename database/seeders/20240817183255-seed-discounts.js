'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const discounts = [
      {
        discountRate: 10.00,
        productId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 15.00,
        productId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 20.00,
        productId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 5.00,
        productId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 25.00,
        productId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 30.00,
        productId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 12.50,
        productId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 18.00,
        productId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 22.50,
        productId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 7.50,
        productId: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 16.00,
        productId: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 8.00,
        productId: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 27.00,
        productId: 13,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 11.50,
        productId: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 14.00,
        productId: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 9.00,
        productId: 16,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 19.00,
        productId: 17,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 24.00,
        productId: 18,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 13.00,
        productId: 19,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        discountRate: 6.00,
        productId: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('discounts', discounts, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('discounts', null, {});
  }
};
