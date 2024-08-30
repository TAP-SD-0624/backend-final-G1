import { Router } from 'express'
import { container } from 'tsyringe'
import { CartController } from '../controllers'
import authAndRoleMiddleware from '../middleware/authMiddleware'
import {
  addProductToCartValidator,
  removeProductFromCartValidator,
} from '../validations'

const cartRouter = Router()
const cartController = container.resolve(CartController)

cartRouter.get(
  '/get',
  authAndRoleMiddleware(['user']),
  cartController.GetCartByUserId.bind(cartController)
)

cartRouter.patch(
  '/clear',
  authAndRoleMiddleware(['user']),
  cartController.ClearCart.bind(cartController)
)

cartRouter.post(
  '/product/set',
  authAndRoleMiddleware(['user']),
  addProductToCartValidator,
  cartController.SetProductToCart.bind(cartController)
)

cartRouter.delete(
  '/product/delete/:id',
  authAndRoleMiddleware(['user']),
  removeProductFromCartValidator,
  cartController.RemoveProductFromCart.bind(cartController)
)

export default cartRouter
