import { body, param } from 'express-validator'
import { validateResult } from './validateResult'

export const createCommentValidator = [
  body('content').notEmpty().isLength({ max: 1000, min: 10 }).isString(),
  body('productId').notEmpty().isInt().toInt(),
  validateResult,
]

export const updateCommentValidator = [
  param('id').isInt().toInt(),
  body('content').notEmpty().isLength({ max: 1000, min: 20 }).isString(),
  validateResult,
]

export const deleteCommentValidator = [
  param('id').isInt().toInt(),
  validateResult,
]
