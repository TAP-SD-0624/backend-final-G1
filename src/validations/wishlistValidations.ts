import { body, param } from 'express-validator'

export const addProductToWishlist = [
  body('productId').notEmpty().isInt().toInt(),
]

export const removeProductFromWishlist = [
  param('productId').notEmpty().isInt().toInt(),
]
