import { Router } from 'express'
import { container } from 'tsyringe'
import { WishlistController } from '../controllers'
import authAndRoleMiddleware from '../middleware/authMiddleware'
import { addAndRemoveProductToWishlist } from '../validations'
import { checkWishlistExists } from '../middleware/checkWishlistExists'

const wishlistRouter = Router()
const wishlistController = container.resolve(WishlistController)

wishlistRouter.use(authAndRoleMiddleware(['user']))
wishlistRouter.use(checkWishlistExists)
wishlistRouter.patch(
  '/',
  addAndRemoveProductToWishlist,
  wishlistController.addOrRemoveProducts.bind(wishlistController)
)
wishlistRouter.get('/', wishlistController.getWishList.bind(wishlistController))
wishlistRouter.delete(
  '/',
  wishlistController.clearWishList.bind(wishlistController)
)

export default wishlistRouter
