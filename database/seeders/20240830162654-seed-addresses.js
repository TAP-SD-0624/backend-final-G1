'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const addresses = [
      {
        state: 'New York',
        city: 'New York City',
        street: '123 5th Ave',
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: '+12125551234',
        email: 'john.doe@example.com',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        state: 'California',
        city: 'Los Angeles',
        street: '456 Sunset Blvd',
        firstName: 'Jane',
        lastName: 'Smith',
        mobileNumber: '+13105556789',
        email: 'jane.smith@example.com',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        state: 'Illinois',
        city: 'Chicago',
        street: '789 Michigan Ave',
        firstName: 'Michael',
        lastName: 'Johnson',
        mobileNumber: '+13125552345',
        email: 'michael.johnson@example.com',
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        state: 'Texas',
        city: 'Austin',
        street: '1010 Congress Ave',
        firstName: 'Emily',
        lastName: 'Davis',
        mobileNumber: '+15125553456',
        email: 'emily.davis@example.com',
        userId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        state: 'New York',
        city: 'Brooklyn',
        street: '111 8th St',
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: '+12125551234',
        email: 'john.doe@example.com',
        userId: 1, // Same user as first address
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        state: 'Florida',
        city: 'Miami',
        street: '222 Ocean Dr',
        firstName: 'Linda',
        lastName: 'Brown',
        mobileNumber: '+17865555678',
        email: 'linda.brown@example.com',
        userId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    return queryInterface.bulkInsert('addresses', addresses, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('addresses', null, {});
  }
};
