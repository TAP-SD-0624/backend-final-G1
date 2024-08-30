'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orderProducts = [
      { orderId: 1, productId: 1, quantity: 2, totalPrice: 259.98, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 1, productId: 2, quantity: 1, totalPrice: 149.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 2, productId: 3, quantity: 1, totalPrice: 29.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 2, productId: 4, quantity: 1, totalPrice: 59.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 3, productId: 5, quantity: 1, totalPrice: 199.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 3, productId: 6, quantity: 1, totalPrice: 109.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 4, productId: 7, quantity: 2, totalPrice: 79.98, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 4, productId: 8, quantity: 1, totalPrice: 39.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 5, productId: 9, quantity: 1, totalPrice: 59.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 5, productId: 10, quantity: 1, totalPrice: 89.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 2, productId: 11, quantity: 1, totalPrice: 19.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 2, productId: 12, quantity: 1, totalPrice: 79.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 3, productId: 13, quantity: 1, totalPrice: 99.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 5, productId: 14, quantity: 1, totalPrice: 129.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 4, productId: 15, quantity: 1, totalPrice: 99.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 1, productId: 16, quantity: 2, totalPrice: 499.98, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 1, productId: 17, quantity: 1, totalPrice: 149.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 4, productId: 18, quantity: 1, totalPrice: 129.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 2, productId: 19, quantity: 1, totalPrice: 179.99, createdAt: new Date(), updatedAt: new Date() },
      { orderId: 3, productId: 20, quantity: 1, totalPrice: 299.99, createdAt: new Date(), updatedAt: new Date() }
    ];

    return queryInterface.bulkInsert('orderProduct', orderProducts, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('orderProduct', null, {});
  }
};
