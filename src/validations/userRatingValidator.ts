import { body } from 'express-validator'
import { validateResult } from './validateResult'

export const createAndUpdateUserRatingValidator = [
  body('rating').notEmpty().isInt({ min: 1, max: 5 }).withMessage("Rating must be an integer").toInt(),
  body("productId").notEmpty().isInt().withMessage("ProductId must be an integer").toInt(),
  validateResult,
]
