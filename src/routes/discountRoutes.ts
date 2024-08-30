import { Router } from 'express'
import { container } from 'tsyringe'

import { DiscountController } from '../controllers'
import authAndRoleMiddleware from '../middleware/authMiddleware'
import { createDiscountValidator } from '../validations/discountValidator'

const discountRouter = Router()
const discountController = container.resolve(DiscountController)

discountRouter.post(
  '/Add',
  createDiscountValidator,
  authAndRoleMiddleware(['admin']),

  discountController.AddDiscount.bind(discountController)
)

export default discountRouter
