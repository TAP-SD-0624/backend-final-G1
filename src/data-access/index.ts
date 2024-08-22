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
export const userRepository = new UserRepository(User)
export const cartRepository = new CartRepository(Cart)
export const commentRepository = new CommentRepository(Comment)
export const productRepository = new ProductRepository(Product)
export const categoryRepository = new CategoryRepository(Category)
export const discountRepository = new DiscountRepository(Discount)
export const brandRepository = new BrandRepository(Brand)
export const wishlistRepository = new WishlistRepository(Wishlist)
export const userRatingRepository = new UserRatingRepository(UserRating)
export const imageRepository = new ImageRepository(Image)
export const dashboardRepository = new DashboardRepository()
export const orderRepository = new OrderRepository(Order)
