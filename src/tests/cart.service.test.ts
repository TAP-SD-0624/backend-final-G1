import 'reflect-metadata'
import CartService from '../services/cart.service'
import { cartRepository, productRepository } from '../data-access'
import {
  InternalServerError,
  NotFoundError,
  InsufficientStockError,
} from '../Errors'
import { Cart, Product } from '../models'
import { CartDTO, CartProductDTO } from '../Types/DTO/cartDto'
import { GetProductDTO } from '../Types/DTO/productDto'
import { ILogger } from '../helpers/Logger/ILogger'
jest.mock('../data-access/cartRepository')
jest.mock('../data-access/productRepository')
jest.mock('../helpers/Products/ProductToProductDTO')
jest.mock('../models/Cart.model', () => {
  const actual = jest.requireActual('../models/Cart.model')
  return {
    ...actual,
    Cart: jest.fn().mockImplementation(() => ({
      id: 1,
      userId: 1,
      products: [],
      toJSON() {
        return { id: 1, userId: 1, products: [] }
      },
    })),
  }
})

jest.mock('../models/Product.model.ts', () => {
  return {
    Product: jest.fn().mockImplementation(() => {
      return {
        id: 1,
        name: 'Sample Product',
        price: 99.99,
        description: 'This is a sample product',
        stock: 100,
        averageRating: 4.5,
        ratingCount: 10,
        brandId: 1,
        toJSON() {
          return {
            id: 1,
            name: 'Sample Product',
            price: 99.99,
            description: 'This is a sample product',
            stock: 100,
            averageRating: 4.5,
            ratingCount: 10,
            brandId: 1,
          }
        },
        save: jest.fn().mockResolvedValue(this),
        destroy: jest.fn().mockResolvedValue(this),
        reload: jest.fn().mockResolvedValue(this),
        // Mock any other methods or relationships as needed
      }
    }),
  }
})
describe('CartService', () => {
  let cartService: CartService
  let mockLogger: ILogger

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    }
    cartService = new CartService(mockLogger)
    jest.clearAllMocks()
  })

  describe('GetCartByUserId', () => {
    it('P0: should return a cart for a user if it exists', async () => {
      const userId = 1
      const cart = new Cart()
      cart.id = 1
      cart.userId = userId
      cart.products = [new Product()]
      ;(cartRepository.findCartByUserId as jest.Mock).mockResolvedValue(cart)
      const result = await cartService.GetCartByUserId(userId)

      expect(cartRepository.findCartByUserId).toHaveBeenCalledWith(userId)
      expect(result).toEqual({
        id: cart.id,
        userId: cart.userId,
        products: expect.any(Array),
      })
    })

    it('P0: should create a new cart if one does not exist for the user', async () => {
      const userId = 1
      const newCart = new Cart()
      newCart.userId = userId
      ;(cartRepository.findCartByUserId as jest.Mock).mockResolvedValue(null)
      ;(cartRepository.create as jest.Mock).mockResolvedValue(newCart)

      const result = await cartService.GetCartByUserId(userId)

      expect(cartRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: userId,
          products: [],
        })
      )
    })

    it('P1: should throw an InternalServerError if an error occurs', async () => {
      const userId = 1

      ;(cartRepository.findCartByUserId as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(cartService.GetCartByUserId(userId)).rejects.toThrow(
        InternalServerError
      )
    })
  })

  describe('DeleteCart', () => {
    it('P0: should delete the cart if it exists', async () => {
      const cartId = 1

      ;(cartRepository.deleteCart as jest.Mock).mockResolvedValue(true)

      await cartService.DeleteCart(cartId)

      expect(cartRepository.deleteCart).toHaveBeenCalledWith(cartId)
    })

    it('P1: should throw an error if the cart deletion fails', async () => {
      const cartId = 1

      ;(cartRepository.deleteCart as jest.Mock).mockResolvedValue(false)

      await expect(cartService.DeleteCart(cartId)).rejects.toThrow(
        'internal server error, please try again later'
      )
    })
  })

  describe('ClearCart', () => {
    it('P0: should clear the cart if it exists', async () => {
      const userId = 1
      const cart = new Cart()
      cart.id = 1
      cart.userId = userId
      ;(cartRepository.findCartByUserId as jest.Mock).mockResolvedValue(cart)
      ;(cartRepository.ClearCart as jest.Mock).mockResolvedValue(true)

      const result = await cartService.ClearCart(userId)

      expect(cartRepository.ClearCart).toHaveBeenCalledWith(cart.id)
      expect(result).toBe(true)
    })

    it('P0: should create a new cart if one does not exist and return true', async () => {
      const userId = 1
      const newCart = new Cart()
      newCart.userId = userId
      ;(cartRepository.findCartByUserId as jest.Mock).mockResolvedValue(null)
      ;(cartRepository.create as jest.Mock).mockResolvedValue(newCart)

      const result = await cartService.ClearCart(userId)

      expect(cartRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: userId,
          products: [],
        })
      )
    })

    it('P1: should throw an InternalServerError if an error occurs', async () => {
      const userId = 1

      ;(cartRepository.findCartByUserId as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(cartService.ClearCart(userId)).rejects.toThrow(
        InternalServerError
      )
    })
  })

  describe('AddProductToCart', () => {
    it('P0: should add a product to the cart if it exists', async () => {
      const userId = 1
      const productId = 123
      const quantity = 2
      const product = new Product()
      product.id = productId
      product.stock = 10
      const cart = new Cart()
      cart.id = 1
      cart.userId = userId
      ;(cartRepository.findCartByUserId as jest.Mock).mockResolvedValue(cart)
      ;(productRepository.findById as jest.Mock).mockResolvedValue(product)
      ;(cartRepository.SetProductInCart as jest.Mock).mockResolvedValue(true)

      const result = await cartService.AddProductToCart(
        userId,
        productId,
        quantity
      )

      expect(cartRepository.SetProductInCart).toHaveBeenCalledWith(
        cart.id,
        productId,
        quantity
      )
      expect(result).toBe(true)
    })

    it('P1: should throw a NotFoundError if the product does not exist', async () => {
      const userId = 1
      const productId = 123
      const quantity = 2

      ;(cartRepository.findCartByUserId as jest.Mock).mockResolvedValue(
        new Cart()
      )
      ;(productRepository.findById as jest.Mock).mockResolvedValue(null)

      await expect(
        cartService.AddProductToCart(userId, productId, quantity)
      ).rejects.toThrow(NotFoundError)
    })

    it('P1: should throw an InsufficientStockError if there is not enough stock', async () => {
      const userId = 1
      const productId = 123
      const quantity = 2
      const product = new Product()
      product.id = productId
      product.stock = 1
      ;(cartRepository.findCartByUserId as jest.Mock).mockResolvedValue(
        new Cart()
      )
      ;(productRepository.findById as jest.Mock).mockResolvedValue(product)

      await expect(
        cartService.AddProductToCart(userId, productId, quantity)
      ).rejects.toThrow(InsufficientStockError)
    })

    it('P1: should throw an InternalServerError if an error occurs', async () => {
      const userId = 1
      const productId = 123
      const quantity = 2

      ;(cartRepository.findCartByUserId as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        cartService.AddProductToCart(userId, productId, quantity)
      ).rejects.toThrow(InternalServerError)
    })
  })

  describe('removeProductFromCart', () => {
    it('P0: should remove a product from the cart', async () => {
      const userId = 1
      const productId = 123
      const cart = new Cart()
      cart.id = 1
      cart.userId = userId
      ;(cartRepository.findCartByUserId as jest.Mock).mockResolvedValue(cart)
      ;(cartRepository.RemoveProductFromCart as jest.Mock).mockResolvedValue(
        true
      )

      await cartService.removeProductFromCart(userId, productId)

      expect(cartRepository.RemoveProductFromCart).toHaveBeenCalledWith(
        cart.id,
        productId
      )
    })

    it('P1: should throw an InternalServerError if an error occurs', async () => {
      const userId = 1
      const productId = 123

      ;(cartRepository.findCartByUserId as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        cartService.removeProductFromCart(userId, productId)
      ).rejects.toThrow(InternalServerError)
    })
  })

  describe('getCartProductByUserId', () => {
    it('P0: should return a list of products in the cart for a user', async () => {
      const userId = 1
      const cartProducts = [new Cart()]

      ;(cartRepository.findCartProductByUserId as jest.Mock).mockResolvedValue(
        cartProducts
      )

      const result = await cartService.getCartProductByUserId(userId)

      expect(cartRepository.findCartProductByUserId).toHaveBeenCalledWith(
        userId
      )
      expect(result).toEqual(cartProducts)
    })

    it('P0: should throw an error if no cart is found for the user', async () => {
      const userId = 1

      ;(cartRepository.findCartProductByUserId as jest.Mock).mockResolvedValue(
        null
      )

      await expect(cartService.getCartProductByUserId(userId)).rejects.toThrow(
        Error
      )
    })

    it('P1: should throw an InternalServerError if an error occurs', async () => {
      const userId = 1

      ;(cartRepository.findCartProductByUserId as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(cartService.getCartProductByUserId(userId)).rejects.toThrow(
        Error
      )
    })
  })
})
