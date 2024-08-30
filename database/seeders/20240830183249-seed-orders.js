'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Retrieve users, products, and addresses for seeding
    const [users] = await queryInterface.sequelize.query('SELECT id FROM users;');
    const [products] = await queryInterface.sequelize.query('SELECT id FROM products;');
    const [addresses] = await queryInterface.sequelize.query('SELECT id FROM addresses;');

    if (!users.length || !products.length || !addresses.length) {
      throw new Error('Missing data for users, products, or addresses');
    }

    const now = new Date();

    const orders = [
      {
        status: 'processed',
        isPaid: false,
        userId: users[0].id,
        addressId: addresses[0].id,
        createdAt: now,
        updatedAt: now,
      },
      {
        status: 'outForDelivery',
        isPaid: true,
        userId: users[1].id,
        addressId: addresses[1].id,
        createdAt: now,
        updatedAt: now,
      },
      {
        status: 'delivered',
        isPaid: true,
        userId: users[0].id, // Same userId as the first order
        addressId: addresses[2].id,
        createdAt: now,
        updatedAt: now,
      },
      {
        status: 'delivered',
        isPaid: false,
        userId: users[2].id,
        addressId: addresses[3].id,
        createdAt: now,
        updatedAt: now,
      },
      {
        status: 'processed',
        isPaid: false,
        userId: users[1].id, // Same userId as the second order
        addressId: addresses[4].id,
        createdAt: now,
        updatedAt: now,
      },
    ];

    return queryInterface.bulkInsert('orders', orders, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('orders', null, {});
  }
};
