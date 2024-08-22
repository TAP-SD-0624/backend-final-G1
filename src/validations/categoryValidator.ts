import { body, param } from 'express-validator'
import { validateResult } from './validateResult'

export const getCategoryByIdValidator = [
  param('id').notEmpty().isInt().toInt(),
  validateResult,
]

export const createCategoryValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('name').isString().withMessage('Name must be String'),
  validateResult,
]

export const updateCategoryValidator = [
  param('id').isInt().toInt().withMessage('CategoryId must be an integer'),
  body('name').isString().withMessage('Category name must be a string'),
  body('name').notEmpty().withMessage('Category Name is required'),
  validateResult,
]

export const deleteCategoryValidator = [
  param('id').isInt().toInt().withMessage('CategoryId must be an integer'),
  validateResult,
]
