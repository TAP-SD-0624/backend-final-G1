import { Cart } from '../models'
import { cartRepository, productRepository } from '../data-access'
import { CartDTO } from '../Types/DTO/cartDto'

export default class CartService {
  async createCart(
    cartData: CartDTO,
    products: { productId: number; quantity: number }[]
  ): Promise<Cart> {
    try {
      // Step 1: Create a new cart instance and set the userId
      const newCart = new Cart()
      newCart.userId = cartData.userId

      // Step 2: Save the cart to the database
      const savedCart = await cartRepository.create(newCart)
      if (!savedCart) {
        throw new Error('Failed to create cart')
      }

      // Step 3: Loop through products and add them to the cart
      for (const { productId, quantity } of products) {
        await this.ensureProductExists(productId)
        const productAdded = await this.addProductToCart(
          savedCart.id,
          productId,
          quantity
        )
        if (!productAdded) {
          throw new Error(`Failed to add product with ID ${productId} to cart`)
        }
      }

      return savedCart
    } catch (error: any) {
      throw new Error(
        `Error creating cart and adding products: ${error.message}`
      )
    }
  }

  async getCartByUserId(userId: number): Promise<Cart[]> {
    try {
      const cart = await cartRepository.findCartByUserId(userId)
      if (!cart) {
        throw new Error(`No cart found for user ID ${userId}`)
      }
      return cart
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
      const deleted = await cartRepository.deleteCart(cartId)
      if (!deleted) {
        throw new Error('Failed to delete cart')
      }
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

  async getCartProductByUserId(userId: number): Promise<Cart[]> {
    try {
      const cart = await cartRepository.findCartProductByUserId(userId)
      if (!cart || cart.length === 0) {
        throw new Error('Cart not found')
      }
      return cart
    } catch (error: any) {
      throw new Error(`Error retrieving cart product: ${error.message}`)
    }
  }

  async getCartByID(cartId: number): Promise<Cart> {
    try {
      const cart = await cartRepository.findById(cartId)
      if (!cart) {
        throw new Error('Cart not found')
      }

      const cartWithProducts = await cartRepository.findCartProductById(cartId)
      if (!cartWithProducts) {
        throw new Error('Failed to retrieve cart products')
      }

      return cartWithProducts
    } catch (error: any) {
      throw new Error(`Error retrieving cart: ${error.message}`)
    }
  }

  /**
   * Helper method to ensure a product exists by ID.
   * @param {number} productId - The ID of the product.
   * @throws {Error} If the product does not exist.
   */
  private async ensureProductExists(productId: number): Promise<void> {
    const productData = await productRepository.GetProduct(productId)
    if (!productData) {
      throw new Error(`Product with ID ${productId} not found`)
    }
  }
}
