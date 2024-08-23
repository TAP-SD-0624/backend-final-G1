import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
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
  Brand,
  Image,
  Address,
} from '../models'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD,
  {
    logging: false,
    host: process.env.DB_HOST,
    dialect: 'postgres',
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
      Brand,
      Wishlist,
      ProductCategory,
      WishlistProduct,
      Image,
      Address
    ],
  }
)

export default sequelize
