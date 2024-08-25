'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.sequelize.transaction(function (t) {
      return queryInterface.sequelize.query('SELECT id FROM users;', { transaction: t })
        .then(function ([users]) { 
          if (!users || users.length === 0) {
            throw new Error('No users found to create carts');
          }

          return queryInterface.sequelize.query('SELECT id FROM products;', { transaction: t })
            .then(function ([products]) { 
              if (!products || products.length === 0) {
                throw new Error('No products found to create carts');
              }

              var now = new Date();

              var cartData = [
                {
                  userId: users[0].id,
                  createdAt: now,
                  updatedAt: now
                },
                {
                  userId: users[1].id,
                  createdAt: now,
                  updatedAt: now
                }
              ];

              return queryInterface.bulkInsert('carts', cartData, { transaction: t }).then(function () {
                return queryInterface.sequelize.query('SELECT id FROM carts;', { transaction: t })
                  .then(function ([carts]) { 
                    if (!carts || carts.length === 0) {
                      throw new Error('No carts found after insertion');
                    }

                    var cartProductData = [
                      { cartId: carts[0].id, productId: products[0].id, quantity: 2, createdAt: now, updatedAt: now },
                      { cartId: carts[0].id, productId: products[1].id, quantity: 3, createdAt: now, updatedAt: now },
                      { cartId: carts[1].id, productId: products[2].id, quantity: 1, createdAt: now, updatedAt: now },
                      { cartId: carts[1].id, productId: products[3].id, quantity: 4, createdAt: now, updatedAt: now },
                    ];

                    return queryInterface.bulkInsert('cartProduct', cartProductData, { transaction: t });
                  });
              });
            });
        });
    });
  },

  down: function (queryInterface) {
    return queryInterface.sequelize.transaction(function (t) {
      return queryInterface.bulkDelete('cartProduct', null, { truncate: true, transaction: t })
        .then(function () {
          return queryInterface.bulkDelete('carts', null, { truncate: true, transaction: t });
        });
    });
  }
};
