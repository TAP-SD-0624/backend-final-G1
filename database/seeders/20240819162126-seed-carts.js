'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.sequelize.transaction(async function (t) {
      const [users] = await queryInterface.sequelize.query('SELECT id FROM users;', { transaction: t });
      if (!users || users.length < 10) {
        throw new Error('Not enough users found to create carts');
      }

      const [products] = await queryInterface.sequelize.query('SELECT id FROM products;', { transaction: t });
      if (!products || products.length === 0) {
        throw new Error('No products found to create carts');
      }

      const now = new Date();
      const cartData = users.slice(0, 10).map((user, index) => ({
        userId: user.id,
        createdAt: now,
        updatedAt: now
      }));

      await queryInterface.bulkInsert('carts', cartData, { transaction: t });

      const [carts] = await queryInterface.sequelize.query('SELECT id FROM carts;', { transaction: t });
      if (!carts || carts.length === 0) {
        throw new Error('No carts found after insertion');
      }

      const cartProductData = carts.map((cart, index) => {
        const randomProductIds = products.sort(() => 0.5 - Math.random()).slice(0, 2);
        return randomProductIds.map((product, productIndex) => ({
          cartId: cart.id,
          productId: product.id,
          quantity: Math.floor(Math.random() * 5) + 1,
          createdAt: now,
          updatedAt: now
        }));
      }).flat();

      return queryInterface.bulkInsert('cartProduct', cartProductData, { transaction: t });
    });
  },

  down: function (queryInterface) {
    return queryInterface.sequelize.transaction(async function (t) {
      await queryInterface.bulkDelete('cartProduct', null, { truncate: true, transaction: t });
      await queryInterface.bulkDelete('carts', null, { truncate: true, transaction: t });
    });
  }
};
