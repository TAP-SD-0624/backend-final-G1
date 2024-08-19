import { Router } from 'express'
import { container } from 'tsyringe'
import { WishlistController } from '../controllers/wishlistController'
import authAndRoleMiddleware from '../middleware/authMiddleware'
import { addProductToWishlist } from '../validations/wishlistValidations'
import { checkWishlistExists } from '../middleware/checkWishlistExists'

const wishlistRouter = Router()
const wishlistController = container.resolve(WishlistController)

wishlistRouter.use(authAndRoleMiddleware(['user']))
wishlistRouter.use(checkWishlistExists)
wishlistRouter.post(
  '/',
  addProductToWishlist,
  wishlistController.addProductToWishlist.bind(wishlistController)
)
wishlistRouter.get('/', wishlistController.getWishList.bind(wishlistController))
wishlistRouter.delete(
  '/:productId',
  addProductToWishlist,
  wishlistController.removeProductFromWishlist.bind(wishlistController)
)
wishlistRouter.delete(
  '/',
  wishlistController.clearWishList.bind(wishlistController)
)

export default wishlistRouter
