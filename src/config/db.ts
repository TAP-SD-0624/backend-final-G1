import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import {
  User,
  Cart,
  CartProduct,
  Category,
  Comment,
  Discount,
  Order,
  OrderProduct,
  Product,
  UserRating,
  Wishlist,
  ProductCategory,
  WishlistProduct,
} from "../models";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: Number(process.env.DB_PORT),
    // repositoryMode: true,
    models: [
      User,
      Cart,
      CartProduct,
      Category,
      Comment,
      Discount,
      Order,
      OrderProduct,
      Product,
      UserRating,
      Wishlist,
      ProductCategory,
      WishlistProduct,
    ],
  }
);

export default sequelize;
