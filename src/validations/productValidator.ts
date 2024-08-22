import { param, body } from 'express-validator'
import { validateResult } from './validateResult'

export const getProductValidator = [
  param('id').notEmpty().isInt().toInt(),
  validateResult,
]

export const createProductValidator = [
  body('name')
    .isString()
    .withMessage('Product name must be a string')
    .notEmpty()
    .withMessage('Product name is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('brand').optional().isString().withMessage('Brand must be a string'),

  validateResult,
]

export const updateProductValidator = [
  body('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .toInt()
    .withMessage('id must be integer'),

  body('name').optional().isString().withMessage('name must be a string'),
  body('price').optional().isFloat().withMessage('price must be float number'),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be string'),
  body('stock').optional().isInt().toInt().withMessage('stock must be integer'),
]

export const deleteValidator = [
  param('id').isInt().toInt().withMessage('Id must be an integer'),
  validateResult,
]
