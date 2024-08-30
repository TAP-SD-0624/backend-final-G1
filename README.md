# ECommerce Backend API

## Overview

This repository contains the backend API for an eCommerce application. The API is designed to handle core eCommerce functionalities, including user management, product management, cart operations, order processing, and more. It is built using Node.js, Express, and TypeScript, with SupaBase as the database.

## Features

- **User Authentication & Authorization**: Secure login and registration using JWT tokens.
- **Product Management**: CRUD operations for products, including categories and inventory management.
- **Cart Management**: Add, remove, and update items in a user's cart.
- **Order Processing**: Place orders and manage order status.
- **Admin Panel**: Admin routes for managing users, products, and orders.
- **Wishlist**: Allows users to save products to a wishlist.
- **Review System**: Users can leave reviews and ratings for products.
- **Image Processing**: Upload and manage product images.
- **Logging & Error Handling**: Comprehensive logging and error management.
- **Unit Tests**: Testing implemented for key services and controllers.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/TAP-SD-0624/backend-final-G1.git
   cd backend-final-G1
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and configure the necessary environment variables:

   ```env
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=your_database_host
   DB_PORT=your_database_port
   STORAGE_URL=your_storage_url
   STORAGE_KEY=your_storage_key
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the server:**

   ```bash
   npm run dev
   ```

5. **Start the server with Nodemon:**

   ```bash
   npm run watch
   ```
---
## Usage

### API Endpoints

The backend API provides a range of endpoints to manage various aspects of the eCommerce application:

- **Swagger Documentation:**

  Access the API documentation via Swagger:

  ```http
  GET /swagger
  ```

- **Authentication & Users:**

  - Register a new user:
  
    ```http
    POST /api/auth/register
    ```

  - Login:

    ```http
    POST /api/auth/login
    ```

  - Manage users:

    ```http
    GET /api/users
    ```

- **Product Management:**

  - Get all products:

    ```http
    GET /api/products
    ```

  - Manage product categories:

    ```http
    GET /api/categories
    ```

  - Manage product brands:

    ```http
    GET /api/brands
    ```

- **Cart Management:**

  - Add items to cart:

    ```http
    POST /api/carts
    ```

- **Wishlist Management:**

  - Add items to wishlist:

    ```http
    POST /api/wishlists
    ```

- **Order & Checkout:**

  - Manage user addresses:

    ```http
    GET /api/address
    ```

- **Reviews & Ratings:**

  - Manage comments:

    ```http
    GET /api/comments
    ```

  - Manage user ratings:

    ```http
    GET /api/userratings
    ```

- **Discounts & Promotions:**

  - Manage discounts:

    ```http
    GET /api/discounts
    ```

- **Dashboard:**

  - Access admin dashboard data:

    ```http
    GET /api/dashboard
    ```

These routes can be used to interact with the eCommerce application's backend, providing functionality for authentication, product management, cart operations, orders, and more.
---

### Testing

Run unit tests:

```bash
npm run test
```

## Technologies Used

- **Node.js**
- **Express**
- **TypeScript**
- **MySQL**
- **Sequelize** (ORM)
- **JWT** (Authentication)
- **Docker** (Deployment)
- **GitHub Actions** (CI/CD)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
