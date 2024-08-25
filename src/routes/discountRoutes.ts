import { Router } from 'express'
import { container } from 'tsyringe'

import { DiscountController } from '../controllers'
import authAndRoleMiddleware from '../middleware/authMiddleware'

const discountRouter = Router()
const discountController = container.resolve(DiscountController)

discountRouter.post(
  '/Add',
  authAndRoleMiddleware(['admin']),
  discountController.AddDiscount.bind(discountController)
)

export default discountRouter
