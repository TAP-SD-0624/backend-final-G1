'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = [
      {
        name: 'Nike Air Max 90',
        price: 129.99,
        description: 'A classic running shoe with a comfortable fit.',
        stock: 100,
        brandId: 1, // Nike
          // Shoes
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Adidas Ultraboost',
        price: 149.99,
        description: 'High-performance shoes for the best running experience.',
        stock: 100,
        brandId: 2, // Adidas
          // Shoes
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Puma T-shirt',
        price: 29.99,
        description: 'Comfortable and stylish t-shirt for everyday wear.',
        stock: 200,
        brandId: 3, // Puma
          // Shirts
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Under Armour Hoodie',
        price: 59.99,
        description: 'A warm hoodie perfect for workouts and casual wear.',
        stock: 150,
        brandId: 4, // Under Armour
          // Shirts
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Reebok Smartwatch',
        price: 199.99,
        description: 'Stay connected with this sleek smartwatch.',
        stock: 50,
        brandId: 5, // Reebok
          // Watches
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'New Balance Running Shoes',
        price: 109.99,
        description: 'Perfect for long-distance runs with great support.',
        stock: 80,
        brandId: 6, // New Balance
          // Shoes
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Asics Sportswear',
        price: 49.99,
        description: 'Breathable and flexible sportswear for any activity.',
        stock: 120,
        brandId: 7, // Asics
          // Sportswear
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Converse Backpack',
        price: 39.99,
        description: 'Stylish and durable backpack for everyday use.',
        stock: 70,
        brandId: 8, // Converse
          // Bags
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Vans Sunglasses',
        price: 59.99,
        description: 'Protect your eyes with these fashionable sunglasses.',
        stock: 90,
        brandId: 9, // Vans
          // Sunglasses
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Levi\'s Jeans',
        price: 89.99,
        description: 'Classic Levi\'s jeans for a timeless look.',
        stock: 200,
        brandId: 10, // Levi's
          // Shirts
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'H&M T-shirt',
        price: 19.99,
        description: 'Affordable and comfortable t-shirt for daily wear.',
        stock: 250,
        brandId: 11, // H&M
          // Shirts
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Zara Handbag',
        price: 79.99,
        description: 'Stylish handbag for any occasion.',
        stock: 60,
        brandId: 12, // Zara
          // Handbags
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Gap Jacket',
        price: 99.99,
        description: 'Keep warm with this stylish and durable jacket.',
        stock: 110,
        brandId: 13, // Gap
          // Shirts
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Tommy Hilfiger Watch',
        price: 129.99,
        description: 'A sophisticated watch for any occasion.',
        stock: 80,
        brandId: 14, // Tommy Hilfiger
          // Watches
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Calvin Klein Sunglasses',
        price: 99.99,
        description: 'Stylish and modern sunglasses to complete your look.',
        stock: 90,
        brandId: 15, // Calvin Klein
          // Sunglasses
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Michael Kors Handbag',
        price: 249.99,
        description: 'Luxury handbag with a timeless design.',
        stock: 40,
        brandId: 16, // Michael Kors
          // Handbags
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ray-Ban Aviator Sunglasses',
        price: 149.99,
        description: 'Iconic aviator sunglasses for a classic style.',
        stock: 100,
        brandId: 17, // Ray-Ban
          // Sunglasses
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Oakley Sports Sunglasses',
        price: 129.99,
        description: 'High-performance sunglasses for active lifestyles.',
        stock: 75,
        brandId: 18, // Oakley
          // Sunglasses
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fossil Chronograph Watch',
        price: 179.99,
        description: 'Stylish chronograph watch for everyday use.',
        stock: 50,
        brandId: 19, // Fossil
          // Watches
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Seiko Dive Watch',
        price: 299.99,
        description: 'Reliable and durable dive watch for underwater adventures.',
        stock: 30,
        brandId: 20, // Seiko
          // Watches
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    return queryInterface.bulkInsert('products', products, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('products', null, {});
  }
};
