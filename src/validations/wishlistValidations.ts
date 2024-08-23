import { body, param } from 'express-validator'
import { validateResult } from './validateResult'

export const addAndRemoveProductToWishlist = [
  body('productId')
    .notEmpty()
    .isInt()
    .withMessage('ProductId must be in parameter and Integer')
    .toInt(),
  body('mode')
    .notEmpty()
    .isIn(['add', 'remove'])
    .withMessage(
      'The mode of updating the wishlist must be either add or remove'
    ),
  validateResult,
]
