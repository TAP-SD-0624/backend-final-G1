import { body } from 'express-validator'
import { validateResult } from './validateResult'

export const createDiscountValidator = [
  body('productId').isInt().toInt(),
  body('discountValue').isInt({ min: 0, max: 100 }).toInt(),
  validateResult,
]
