import { Router } from 'express'
import { container } from 'tsyringe'
import { UserRatingController } from '../controllers/userRatingController'
import { createAndUpdateUserRatingValidator } from '../validations'
import authAndRoleMiddleware from '../middleware/authMiddleware'

const userRatingRouter = Router()
const userRatingController = container.resolve(UserRatingController)

userRatingRouter.post(
  '/',
  authAndRoleMiddleware(['user']),
  createAndUpdateUserRatingValidator,
  userRatingController.createUserRating.bind(userRatingController)
)
userRatingRouter.patch(
  '/',
  authAndRoleMiddleware(['user']),
  createAndUpdateUserRatingValidator,
  userRatingController.updateUserRating.bind(userRatingController)
)

export default userRatingRouter
