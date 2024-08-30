import {
  Brand,
  Cart,
  Category,
  Comment,
  Discount,
  Image,
  Product,
  User,
  Order,
  Wishlist,
  UserRating,
  Address,
} from '../models'
import { OrderRepository } from './OrderRepository'

import { CommentRepository } from './CommentRepository'
import { UserRepository } from './UserRepository'
import { CategoryRepository } from './CategoryRepository'
import { CartRepository } from './CartRepository'
import { ProductRepository } from './ProductRepository'
import { WishlistRepository } from './WishListRepository'
import { DiscountRepository } from './DiscountRepository'
import { BrandRepository } from './BrandRepository'
import { UserRatingRepository } from './UserRatingRepository'
import { ImageRepository } from './ImageRepository'
import { DashboardRepository } from './DashboardRepository'
import { AddressRepository } from './AddressRepository'
import {
  IAddressRepository,
  IBrandRepository,
  ICartRepository,
  ICategoryRepository,
  ICommentRepository,
  IDiscountRepository,
  IImageRepository,
  IProductRepository,
  IUserRepository,
} from './Interfaces'
import { IWishlistRepository } from './Interfaces/IWishListRepository'
import { IUserRatingRepository } from './Interfaces/IUserRatingRepository'
import { IDashboardRepository } from './Interfaces/IDashboardRepository'
import { IOrderRepository } from './Interfaces/IOrderRepository'
export const userRepository: IUserRepository = new UserRepository(User)
export const cartRepository: ICartRepository = new CartRepository(Cart)
export const commentRepository: ICommentRepository = new CommentRepository(
  Comment
)
export const productRepository: IProductRepository = new ProductRepository(
  Product
)
export const categoryRepository: ICategoryRepository = new CategoryRepository(
  Category
)
export const discountRepository: IDiscountRepository = new DiscountRepository(
  Discount
)
export const brandRepository: IBrandRepository = new BrandRepository(Brand)
export const wishlistRepository: IWishlistRepository = new WishlistRepository(
  Wishlist
)
export const userRatingRepository: IUserRatingRepository =
  new UserRatingRepository(UserRating)
export const imageRepository: IImageRepository = new ImageRepository(Image)
export const dashboardRepository: IDashboardRepository =
  new DashboardRepository()
export const orderRepository: IOrderRepository = new OrderRepository(Order)
export const addressRepository: IAddressRepository = new AddressRepository(
  Address
)
