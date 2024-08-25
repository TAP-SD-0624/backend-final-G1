'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function (t) {
      return queryInterface.sequelize.query('SELECT id FROM users;', { transaction: t })
        .then(function (users) {
          return queryInterface.sequelize.query('SELECT id FROM products;', { transaction: t })
            .then(function (products) {
              if (users[0].length === 0 || products[0].length === 0) {
                throw new Error('No users or products found to create wishlists');
              }

              const now = new Date();

              var wishlistData = [
                {
                  userId: users[0][0].id,
                  products: [products[0][0].id, products[0][1].id],

                },
                {
                  userId: users[0][1].id,
                  products: [products[0][2].id, products[0][3].id],

                }
              ];

              return queryInterface.bulkInsert('wishlists', [
                { userId: wishlistData[0].userId, createdAt: now, updatedAt: now },
                { userId: wishlistData[1].userId, createdAt: now, updatedAt: now },
              ], { transaction: t }).then(function () {
                return queryInterface.sequelize.query('SELECT id FROM wishlists;', { transaction: t })
                  .then(function (wishlists) {
                    var wishlistProductData = [
                      { wishlistId: wishlists[0][0].id, productId: wishlistData[0].products[0], createdAt: now, updatedAt: now },
                      { wishlistId: wishlists[0][0].id, productId: wishlistData[0].products[1], createdAt: now, updatedAt: now },
                      { wishlistId: wishlists[0][1].id, productId: wishlistData[1].products[0], createdAt: now, updatedAt: now },
                      { wishlistId: wishlists[0][1].id, productId: wishlistData[1].products[1], createdAt: now, updatedAt: now },
                    ];

                    return queryInterface.bulkInsert('wishlistProduct', wishlistProductData, { transaction: t });
                  });
              });
            });
        });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(function (t) {
      return queryInterface.bulkDelete('WishlistProducts', null, { truncate: true, transaction: t })
        .then(function () {
          return queryInterface.bulkDelete('Wishlists', null, { truncate: true, transaction: t });
        });
    });
  }
};
