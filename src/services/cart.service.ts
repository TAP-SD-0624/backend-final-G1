import { Cart } from '../models'
import { cartRepository } from '../data-access'
import { CartDTO } from '../Types/DTO/cartDto'

export default class CartService {
  async createCart(
    cartData: CartDTO,
    productId: number,
    quantity: number
  ): Promise<Cart> {
    try {
      // Step 1: Create a new cart
      const newCart = new Cart()
      newCart.userId = cartData.userId
      const cart = await cartRepository.create(newCart)

      if (!cart) {
        throw new Error('Failed to create cart')
      }

      const productAdded = await this.addProductToCart(
        cart.id,
        productId,
        quantity
      )

      if (!productAdded) {
        throw new Error('Failed to add product to cart')
      }

      return cart
    } catch (error: any) {
      throw new Error(
        `Error creating cart and adding product: ${error.message}`
      )
    }
  }

  async getCartByUserId(userId: number): Promise<Cart[] | null> {
    try {
      return await cartRepository.findCartByUserId(userId)
    } catch (error: any) {
      throw new Error(`Error retrieving cart: ${error.message}`)
    }
  }

  async updateCart(cartId: number, cartData: CartDTO): Promise<Cart | null> {
    try {
      const cart = await cartRepository.findById(cartId)
      if (!cart) {
        throw new Error('Cart not found')
      }

      cart.userId = cartData.userId
      return await cartRepository.updateCart(cartId, cart)
    } catch (error: any) {
      throw new Error(`Error updating cart: ${error.message}`)
    }
  }

  async deleteCart(cartId: number): Promise<void> {
    try {
      await cartRepository.deleteCart(cartId)
    } catch (error: any) {
      throw new Error(`Error deleting cart: ${error.message}`)
    }
  }

  async addProductToCart(
    cartId: number,
    productId: number,
    quantity: number
  ): Promise<boolean> {
    try {
      return await cartRepository.addProductToCart(cartId, productId, quantity)
    } catch (error: any) {
      throw new Error(`Error adding product to cart: ${error.message}`)
    }
  }

  async removeProductFromCart(
    cartId: number,
    productId: number
  ): Promise<boolean> {
    try {
      return await cartRepository.removeProductFromCart(cartId, productId)
    } catch (error: any) {
      throw new Error(`Error removing product from cart: ${error.message}`)
    }
  }

  async updateProductQuantity(
    cartId: number,
    productId: number,
    quantity: number
  ): Promise<boolean> {
    try {
      return await cartRepository.updateProductQuantity(
        cartId,
        productId,
        quantity
      )
    } catch (error: any) {
      throw new Error(`Error updating product quantity: ${error.message}`)
    }
  } 
  // function that takes userId and return the cart with the products
  async getCartWithProducts(userId: number): Promise<Cart | null> {
    try {
      
      return await cartRepository.getCartWithProducts(userId)
    } catch (error: any) {
      throw new Error(`Error retrieving cart with products: ${error.message}`)
    }
  }
}
