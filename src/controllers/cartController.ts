import { Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'
import CartService from '../services/cart.service'
import { CartDTO } from '../Types/DTO'
import { Cart } from '../models'
import { AuthenticatedRequest } from '../helpers/AuthenticatedRequest'

@injectable()
export class CartController {
  constructor(@inject(CartService) private cartService: CartService) {}

  async createCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      const products = req.body.products

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' })
        return
      }

      const cartData: CartDTO = {
        userId,
        products: [],
      }

      const cart = await this.cartService.createCart(cartData, products)

      res.status(201).json({
        message: 'Cart created and products added successfully',
        cart,
      })
    } catch (error: any) {
      res.status(500).json({ error: `Error creating cart: ${error.message}` })
    }
  }

  async getCartByUserId(req: Request, res: Response): Promise<Cart[] | null> {
    try {
      const userId = parseInt(req.params.id, 10)
      const cart = await this.cartService.getCartByUserId(userId)
      if (!cart || cart.length === 0) {
        res.status(404).json({ error: 'Cart not found' })
        return null
      }
      res.json(cart)
      return cart
    } catch (error: any) {
      res.status(500).json({ error: error.message })
      return null
    }
  }

  async updateCart(req: Request, res: Response): Promise<Cart | null> {
    try {
      const cartId = parseInt(req.params.id, 10)
      const cartData: CartDTO = req.body
      const cart = await this.cartService.updateCart(cartId, cartData)
      if (!cart) {
        res.status(404).json({ error: 'Cart not found' })
        return null
      }
      res.json(cart)
      return cart
    } catch (error: any) {
      res.status(500).json({ error: error.message })
      return null
    }
  }

  async deleteCart(req: Request, res: Response): Promise<void> {
    try {
      const cartId = parseInt(req.params.id, 10)
      await this.cartService.deleteCart(cartId)
      res.status(204).send()
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async updateProductQuantity(req: Request, res: Response): Promise<void> {
    try {
      const cartId = parseInt(req.params.cartId, 10)
      const productId = parseInt(req.params.productId, 10)
      const { quantity } = req.body

      const success = await this.cartService.updateProductQuantity(
        cartId,
        productId,
        quantity
      )

      if (success) {
        res
          .status(200)
          .json({ message: 'Product quantity updated successfully' })
      } else {
        res.status(400).json({ error: 'Failed to update product quantity' })
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async addProductToCart(req: Request, res: Response): Promise<void> {
    try {
      const cartId = parseInt(req.params.cartId, 10)
      const productId = parseInt(req.params.productId, 10)
      const { quantity } = req.body

      const success = await this.cartService.addProductToCart(
        cartId,
        productId,
        quantity
      )

      if (success) {
        res.status(200).json({ message: 'Product added to cart successfully' })
      } else {
        res.status(400).json({ error: 'Failed to add product to cart' })
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async removeProductFromCart(req: Request, res: Response): Promise<void> {
    try {
      const cartId = parseInt(req.params.cartId, 10)
      const productId = parseInt(req.params.productId, 10)

      const success = await this.cartService.removeProductFromCart(
        cartId,
        productId
      )

      if (success) {
        res
          .status(200)
          .json({ message: 'Product removed from cart successfully' })
      } else {
        res.status(400).json({ error: 'Failed to remove product from cart' })
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async getCartProductsByUserId(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Cart[] | null> {
    try {
      const userId = parseInt(req.params.userId, 10)

      if (req.user?.id !== userId && req.user?.role !== 'admin') {
        res
          .status(403)
          .json({ error: 'Access forbidden: You do not own this cart' })
        return null
      }

      const cart = await this.cartService.getCartProductByUserId(userId)

      if (!cart || cart.length === 0) {
        res.status(404).json({ error: 'Cart not found' })
      } else {
        res.status(200).json(cart)
      }

      return cart
    } catch (error: any) {
      res.status(500).json({ error: error.message })
      return null
    }
  }

  async getCartById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const cartId = parseInt(req.params.cartId, 10)
      const userId = req.user?.id
      const userRole = req.user?.role

      const cart = await this.cartService.getCartByID(cartId)
      if (!cart) {
        res.status(404).json({ error: 'Cart not found' })
        return
      }

      if (cart.userId !== userId && userRole !== 'admin') {
        res
          .status(403)
          .json({ error: 'Access forbidden: You do not own this cart' })
        return
      }

      res.json(cart)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
