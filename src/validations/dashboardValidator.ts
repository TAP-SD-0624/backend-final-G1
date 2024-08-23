import { body, query } from 'express-validator'
import { validateResult } from './validateResult'

export const getMostBoughtProductsOverTimeValidator = [
  query('startTime').isISO8601().toDate(),
  query('endTime').isISO8601().toDate(),
  validateResult,
]

export const getProductsNotBoughtValidator = [
  query('startTime').isISO8601().toDate(),
  query('endTime').isISO8601().toDate(),
  validateResult,
]

export const getProductsPerStateValidator = [
  query('state').isString(),
  validateResult,
]
export const dropItemsFromListValidator = [
  body('ids').isArray(),
  validateResult,
]
