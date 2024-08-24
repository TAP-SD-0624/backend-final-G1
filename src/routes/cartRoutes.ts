import { Router } from 'express'
import { container } from 'tsyringe'
import { CartController } from '../controllers/cartController'
import authAndRoleMiddleware from '../middleware/authMiddleware'
import {
  createCartValidator,
  updateCartValidator,
  deleteCartValidator,
  getCartValidator,
  updateProductQuantityValidator,
  addProductToCartValidator,
  removeProductFromCartValidator,
} from '../validations'

const cartRouter = Router()
const cartController = container.resolve(CartController)

cartRouter.post(
  '/',
  authAndRoleMiddleware(['user', 'admin']),
  createCartValidator,
  cartController.createCart.bind(cartController)
)

cartRouter.get(
  '/:id',
  authAndRoleMiddleware(['admin']),
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
  updateProductQuantityValidator,
  cartController.updateProductQuantity.bind(cartController)
)

cartRouter.post(
  '/:cartId/product/:productId',
  authAndRoleMiddleware(['user', 'admin']),
  addProductToCartValidator,
  cartController.addProductToCart.bind(cartController)
)

cartRouter.delete(
  '/:cartId/product/:productId',
  authAndRoleMiddleware(['user', 'admin']),
  removeProductFromCartValidator,
  cartController.removeProductFromCart.bind(cartController)
)

cartRouter.get(
  '/products/:userId',
  authAndRoleMiddleware(['user', 'admin']),
  getCartValidator,
  cartController.getCartProductsByUserId.bind(cartController)
)

cartRouter.get(
  '/cart/:cartId',
  authAndRoleMiddleware(['user', 'admin']),
  getCartValidator,
  cartController.getCartById.bind(cartController)
)

export default cartRouter
