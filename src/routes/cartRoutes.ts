import { Router } from 'express'
import { container } from 'tsyringe'
import { CartController } from '../controllers/cartController'
import authAndRoleMiddleware from '../middleware/authMiddleware'
import {
  createCartValidator,
  updateCartValidator,
  deleteCartValidator,
  getCartValidator,
} from '../validations'

const cartRouter = Router()
const cartController = container.resolve(CartController)

cartRouter.post(
  '/',
  authAndRoleMiddleware(['user', 'admin']),
  // createCartValidator,
  cartController.createCart.bind(cartController)
)
cartRouter.get(
  '/:id',
  authAndRoleMiddleware(['user', 'admin']),
  getCartValidator,
  cartController.getCartByUserId.bind(cartController)
)
cartRouter.put(
  '/:id',
  authAndRoleMiddleware(['user', 'admin']),
  updateCartValidator,
  cartController.updateCart.bind(cartController)
)
cartRouter.delete(
  '/:id',
  authAndRoleMiddleware(['user', 'admin']),
  deleteCartValidator,
  cartController.deleteCart.bind(cartController)
)

cartRouter.put(
  '/:cartId/product/:productId/quantity',
  authAndRoleMiddleware(['user', 'admin']),
  cartController.updateProductQuantity.bind(cartController)
)

// add product to cart
cartRouter.put(
  '/:cartId/product/:productId',
  authAndRoleMiddleware(['user', 'admin']),
  cartController.addProductToCart.bind(cartController)
)

// remove product from cart
cartRouter.delete(
  '/:cartId/product/:productId',
  authAndRoleMiddleware(['user', 'admin']),
  cartController.removeProductFromCart.bind(cartController)
)

// get cart by user id
cartRouter.get(
  '/products/:userId',
  authAndRoleMiddleware(['user', 'admin']),
  cartController.getCartProductsByUserId.bind(cartController)
)

export default cartRouter
