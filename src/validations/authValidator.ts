import { body } from 'express-validator'
import { validateResult } from './validateResult'

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validateResult,
]

export const validateRegister = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isStrongPassword()

    .matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/)
    .isLength({ min: 6 })
    .withMessage(
      'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    ),

  validateResult,
]

export const validateLogout = [
  body('token').notEmpty().withMessage('Token is required'),
  validateResult,
]
