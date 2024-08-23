import { body, param } from "express-validator";
import { validateResult } from "./validateResult";

export const createAddressValidator = [
  body('state')
    .isString().withMessage('State must be a string')
    .notEmpty().withMessage('State is required'),

  body('city')
    .isString().withMessage('City must be a string')
    .notEmpty().withMessage('City is required'),

  body('street')
    .isString().withMessage('Street must be a string')
    .notEmpty().withMessage('Street is required'),

  body('firstName')
    .isString().withMessage('First name must be a string')
    .notEmpty().withMessage('First name is required'),

  body('lastName')
    .isString().withMessage('Last name must be a string')
    .notEmpty().withMessage('Last name is required'),

  body('email')
    .isEmail().withMessage('Must be a valid email address')
    .notEmpty().withMessage('Email is required'),

  body('mobileNumber')
    .isMobilePhone('any').withMessage('Must be a valid mobile number')
    .notEmpty().withMessage('Mobile number is required'),
  validateResult
]


export const updateAddressValidator = [
  param("id").notEmpty().isInt().withMessage("Id must be an integer").toInt(),
  body('state')
    .optional()
    .isString().withMessage('State must be a string'),

  body('city')
    .optional()
    .isString().withMessage('City must be a string'),

  body('street')
    .optional()
    .isString().withMessage('Street must be a string'),

  body('firstName')
    .optional()
    .isString().withMessage('First name must be a string'),

  body('lastName')
    .optional()
    .isString().withMessage('Last name must be a string'),

  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email address'),

  body('mobileNumber')
    .optional()
    .isMobilePhone('any').withMessage('Must be a valid mobile number'),
  validateResult
]

export const getAndDeleteAddressValidator = [
  param("id").notEmpty().isInt().withMessage("Id must be an integer").toInt(),
  validateResult
]