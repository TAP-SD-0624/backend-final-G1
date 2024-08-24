import { body, param } from 'express-validator'
import { validateResult } from './validateResult'

// Validator for creating a cart
export const createCartValidator = [
  body('products')
    .isArray({ min: 1 })
    .withMessage('Products should be a non-empty array'),
  body('products.*.productId')
    .isInt({ gt: 0 })
    .withMessage('Product ID must be a positive integer')
    .toInt(),
  body('products.*.quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer')
    .toInt(),
  validateResult,
]

// Validator for updating product quantity in the cart
export const updateProductQuantityValidator = [
  param('cartId')
    .isInt({ gt: 0 })
    .withMessage('Cart ID must be a positive integer')
    .toInt(),
  body('products')
    .isArray({ min: 1 })
    .withMessage('Products should be a non-empty array'),
  body('products.*.productId')
    .isInt({ gt: 0 })
    .withMessage('Product ID must be a positive integer')
    .toInt(),
  body('products.*.quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer')
    .toInt(),
  validateResult,
]

// Validator for adding a product to the cart
export const addProductToCartValidator = [
  param('cartId')
    .isInt({ gt: 0 })
    .withMessage('Cart ID must be a positive integer')
    .toInt(),
  body('products')
    .isArray({ min: 1 })
    .withMessage('Products should be a non-empty array'),
  body('products.*.productId')
    .isInt({ gt: 0 })
    .withMessage('Product ID must be a positive integer')
    .toInt(),
  body('products.*.quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer')
    .toInt(),
  validateResult,
]

// Validator for retrieving a cart by user ID
export const getCartValidator = [
  param('userId')
    .isInt({ gt: 0 })
    .withMessage('User ID must be a positive integer')
    .toInt(),
  validateResult,
]

// Validator for deleting a cart
export const deleteCartValidator = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Cart ID must be a positive integer')
    .toInt(),
  validateResult,
]

// Validator for updating a cart
export const updateCartValidator = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Cart ID must be a positive integer')
    .toInt(),
  body('products')
    .isArray({ min: 1 })
    .withMessage('Products should be a non-empty array'),
  body('products.*.productId')
    .isInt({ gt: 0 })
    .withMessage('Product ID must be a positive integer')
    .toInt(),
  body('products.*.quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a positive integer')
    .toInt(),
  validateResult,
]

// Validator for removing a product from the cart
export const removeProductFromCartValidator = [
  param('cartId')
    .isInt({ gt: 0 })
    .withMessage('Cart ID must be a positive integer')
    .toInt(),
  param('productId')
    .isInt({ gt: 0 })
    .withMessage('Product ID must be a positive integer')
    .toInt(),
  validateResult,
]
