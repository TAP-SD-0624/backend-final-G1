import { body, param } from 'express-validator'
import { validateResult } from './validateResult'

export const createCartValidator = [
  body('userId').isInt({ gt: 0 }).toInt(),

  body('products').isArray({ min: 1 }),

  body('products.*.productId').isInt({ gt: 0 }).toInt(),

  body('products.*.quantity').isInt({ gt: 0 }).toInt(),

  validateResult,
]

export const getCartValidator = [
  param('userId').isInt().toInt(),
  validateResult,
]

export const deleteCartValidator = [param('id').isInt().toInt(), validateResult]

export const updateCartValidator = [
  param('id').isInt().toInt(),
  body('userId').isInt({ gt: 0 }).toInt(),

  body('products').isArray({ min: 1 }),

  body('products.*.productId').isInt({ gt: 0 }).toInt(),

  body('products.*.quantity').isInt({ gt: 0 }).toInt(),
]
