import { body, param } from 'express-validator'
import { validateResult } from './validateResult'

// Validator for adding a product to the cart
export const addProductToCartValidator = [
  body('productId')
    .isInt({ gt: 0 })
    .withMessage('Product ID must be a positive integer')
    .toInt(),
  body('quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer')
    .toInt(),
  validateResult,
]

// Validator for removing a product from the cart
export const removeProductFromCartValidator = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Product ID must be a positive integer')
    .toInt(),
  validateResult,
]
