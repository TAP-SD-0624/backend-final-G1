'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const comments = [
      {
        content: 'Great quality, I love these shoes!',
        productId: 1,
        userId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'This shirt fits perfectly, very comfortable.',
        productId: 2,
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'The electronics arrived on time and work as expected.',
        productId: 3,
        userId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Handbag looks exactly like in the picture. High quality!',
        productId: 4,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Love these sunglasses, very stylish!',
        productId: 5,
        userId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'The watch is elegant and matches everything.',
        productId: 6,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'This bag is durable and has a lot of space.',
        productId: 7,
        userId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'The sound quality of these headphones is amazing!',
        productId: 8,
        userId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'These shoes are very comfortable for running.',
        productId: 9,
        userId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Good value for money, the shirt is well-made.',
        productId: 10,
        userId: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'The product quality is decent for the price.',
        productId: 11,
        userId: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Highly recommend this product, worth every penny!',
        productId: 12,
        userId: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Satisfied with this purchase, will buy again.',
        productId: 13,
        userId: 13,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Great customer service and fast shipping!',
        productId: 14,
        userId: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'The material feels cheap, not what I expected.',
        productId: 15,
        userId: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Beautiful design, but a bit too tight for me.',
        productId: 16,
        userId: 16,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'This is my second purchase, and I am very happy.',
        productId: 17,
        userId: 17,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'The item is okay, but delivery took too long.',
        productId: 18,
        userId: 18,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Excellent product, exceeded my expectations.',
        productId: 19,
        userId: 19,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'The product was damaged upon arrival, had to return it.',
        productId: 20,
        userId: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    return queryInterface.bulkInsert('comments', comments, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('comments', null, {});
  }
};
