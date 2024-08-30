'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Retrieve category IDs
    const [categoryRows] = await queryInterface.sequelize.query('SELECT id FROM categories;');

    // Define Product-Category associations
    const productCategories = [
      { productId: 1, categoryId: categoryRows[0].id, createdAt: new Date(), updatedAt: new Date() }, // Nike Air Max 90 - Shoes
      { productId: 2, categoryId: categoryRows[0].id, createdAt: new Date(), updatedAt: new Date() }, // Adidas Ultraboost - Shoes
      { productId: 3, categoryId: categoryRows[1].id, createdAt: new Date(), updatedAt: new Date() }, // Puma T-shirt - Shirts
      { productId: 4, categoryId: categoryRows[1].id, createdAt: new Date(), updatedAt: new Date() }, // Under Armour Hoodie - Shirts
      { productId: 5, categoryId: categoryRows[2].id, createdAt: new Date(), updatedAt: new Date() }, // Reebok Smartwatch - Watches
      { productId: 6, categoryId: categoryRows[0].id, createdAt: new Date(), updatedAt: new Date() }, // New Balance Running Shoes - Shoes
      { productId: 7, categoryId: categoryRows[5].id, createdAt: new Date(), updatedAt: new Date() }, // Asics Sportswear - Sportswear
      { productId: 8, categoryId: categoryRows[6].id, createdAt: new Date(), updatedAt: new Date() }, // Converse Backpack - Bags
      { productId: 9, categoryId: categoryRows[4].id, createdAt: new Date(), updatedAt: new Date() }, // Vans Sunglasses - Sunglasses
      { productId: 10, categoryId: categoryRows[1].id, createdAt: new Date(), updatedAt: new Date() }, // Levi's Jeans - Shirts
      { productId: 11, categoryId: categoryRows[1].id, createdAt: new Date(), updatedAt: new Date() }, // H&M T-shirt - Shirts
      { productId: 12, categoryId: categoryRows[3].id, createdAt: new Date(), updatedAt: new Date() }, // Zara Handbag - Handbags
      { productId: 13, categoryId: categoryRows[1].id, createdAt: new Date(), updatedAt: new Date() }, // Gap Jacket - Shirts
      { productId: 14, categoryId: categoryRows[2].id, createdAt: new Date(), updatedAt: new Date() }, // Tommy Hilfiger Watch - Watches
      { productId: 15, categoryId: categoryRows[4].id, createdAt: new Date(), updatedAt: new Date() }, // Calvin Klein Sunglasses - Sunglasses
      { productId: 16, categoryId: categoryRows[3].id, createdAt: new Date(), updatedAt: new Date() }, // Michael Kors Handbag - Handbags
      { productId: 17, categoryId: categoryRows[4].id, createdAt: new Date(), updatedAt: new Date() }, // Ray-Ban Aviator Sunglasses - Sunglasses
      { productId: 18, categoryId: categoryRows[4].id, createdAt: new Date(), updatedAt: new Date() }, // Oakley Sports Sunglasses - Sunglasses
      { productId: 19, categoryId: categoryRows[2].id, createdAt: new Date(), updatedAt: new Date() }, // Fossil Chronograph Watch - Watches
      { productId: 20, categoryId: categoryRows[2].id, createdAt: new Date(), updatedAt: new Date() }, // Seiko Dive Watch - Watches
    ];

    // Insert Product-Category associations into the database
    return queryInterface.bulkInsert('productCategory', productCategories, {});
  },

  async down(queryInterface, Sequelize) {
    // Delete Product-Category associations
    await queryInterface.bulkDelete('productCategory', null, {});

  }
};
