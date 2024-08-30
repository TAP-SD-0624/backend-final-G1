'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async function (t) {
      const [users] = await queryInterface.sequelize.query('SELECT id FROM users;', { transaction: t });
      const [products] = await queryInterface.sequelize.query('SELECT id FROM products;', { transaction: t });

      if (users.length < 10 || products.length === 0) {
        throw new Error('Not enough users or products found to create wishlists');
      }

      const now = new Date();
      const wishlistsData = users.slice(0, 10).map((user, index) => ({
        userId: user.id,
        createdAt: now,
        updatedAt: now
      }));

      await queryInterface.bulkInsert('wishlists', wishlistsData, { transaction: t });

      const [wishlists] = await queryInterface.sequelize.query('SELECT id FROM wishlists;', { transaction: t });

      const wishlistProductData = wishlists.map((wishlist, index) => {
        const randomProductIds = products.sort(() => 0.5 - Math.random()).slice(0, 2);
        return randomProductIds.map(product => ({
          wishlistId: wishlist.id,
          productId: product.id,
          createdAt: now,
          updatedAt: now
        }));
      }).flat();

      return queryInterface.bulkInsert('wishlistProduct', wishlistProductData, { transaction: t });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async function (t) {
      await queryInterface.bulkDelete('wishlistProduct', null, { truncate: true, transaction: t });
      await queryInterface.bulkDelete('wishlists', null, { truncate: true, transaction: t });
    });
  }
};
