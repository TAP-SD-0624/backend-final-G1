'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userRatings = [
      {
        userId: 1,
        productId: 1,
        rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        productId: 2,
        rating: 3.8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        productId: 3,
        rating: 4.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        productId: 4,
        rating: 5.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5,
        productId: 5,
        rating: 4.2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 6,
        productId: 6,
        rating: 3.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 7,
        productId: 7,
        rating: 4.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 8,
        productId: 8,
        rating: 3.9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 9,
        productId: 9,
        rating: 4.6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 10,
        productId: 10,
        rating: 3.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 11,
        productId: 11,
        rating: 4.3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 12,
        productId: 12,
        rating: 3.2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 13,
        productId: 13,
        rating: 4.8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 14,
        productId: 14,
        rating: 4.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 15,
        productId: 15,
        rating: 3.6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 16,
        productId: 16,
        rating: 4.4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 17,
        productId: 17,
        rating: 4.1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 18,
        productId: 18,
        rating: 3.3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 19,
        productId: 19,
        rating: 4.9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 20,
        productId: 20,
        rating: 4.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return queryInterface.bulkInsert('userRatings', userRatings, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('userRatings', null, {});
  }
};
