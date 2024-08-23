import { body, param } from 'express-validator'
import { validateResult } from './validateResult'

export const createAddressValidator = [
  body('state')
    .isString()
    .withMessage('State must be a string')
    .notEmpty()
    .withMessage('State is required')
    .toLowerCase(),

  body('city')
    .isString()
    .withMessage('City must be a string')
    .notEmpty()
    .withMessage('City is required')
    .toLowerCase(),

  body('street')
    .isString()
    .withMessage('Street must be a string')
    .notEmpty()
    .withMessage('Street is required')
    .toLowerCase(),

  body('firstName')
    .isString()
    .withMessage('First name must be a string')
    .notEmpty()
    .withMessage('First name is required')
    .toLowerCase(),

  body('lastName')
    .isString()
    .withMessage('Last name must be a string')
    .notEmpty()
    .withMessage('Last name is required')
    .toLowerCase(),

  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .notEmpty()
    .withMessage('Email is required'),

  body('mobileNumber')
    .isMobilePhone('any')
    .withMessage('Must be a valid mobile number')
    .notEmpty()
    .withMessage('Mobile number is required'),
  validateResult,
]

export const updateAddressValidator = [
  param('id').notEmpty().isInt().withMessage('Id must be an integer').toInt(),
  body('state')
    .optional()
    .isString()
    .withMessage('State must be a string')
    .toLowerCase(),

  body('city')
    .optional()
    .isString()
    .withMessage('City must be a string')
    .toLowerCase(),

  body('street')
    .optional()
    .isString()
    .withMessage('Street must be a string')
    .toLowerCase(),

  body('firstName')
    .optional()
    .isString()
    .withMessage('First name must be a string')
    .toLowerCase(),

  body('lastName')
    .optional()
    .isString()
    .withMessage('Last name must be a string')
    .toLowerCase(),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address'),

  body('mobileNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Must be a valid mobile number'),
  validateResult,
]

export const getAndDeleteAddressValidator = [
  param('id').notEmpty().isInt().withMessage('Id must be an integer').toInt(),
  validateResult,
]
