import { body } from 'express-validator'
import { validateResult } from './validateResult'

export const createOrderValidator = [
  body('isPaid').optional().isBoolean().toBoolean(),
  validateResult,
]

export const updateOrderValidator = [
  body('isPaid').optional().isBoolean().toBoolean(),
  body('status')
    .optional()
    .isIn(['processed', 'outForDelivery', 'delivered'])
    .isString(),
  validateResult,
]
