import { Cart } from '../models'
import { cartRepository, productRepository } from '../data-access'
import { CartDTO } from '../Types/DTO/cartDto'
import { InternalServerError, NotFoundError } from '../Errors'
import { InsufficientStockError } from '../Errors/InsufficientStockError'
import { GetProductDTO } from '../Types/DTO/productDto'
import { ProductToProductDTO } from '../helpers/Products/ProductToProductDTO'

export default class CartService {
  /**
   *
   * @param userId id for the user that we want the cart for.
   * @throws Error when it fails to get the cart for the user.
   * @returns CartDTO if a cart was found.
   */
  async GetCartByUserId(userId: number): Promise<CartDTO> {
    try {
      let cart = await cartRepository.findCartByUserId(userId)
      if (!cart) {
        let newCart = new Cart()
        newCart.userId = userId
        cart = await cartRepository.create(newCart)
      }

      let products: GetProductDTO[] = []

      cart.products.forEach((item) => {
        products.push(ProductToProductDTO(item))
      })
      const cartDto: CartDTO = { id: cart.id, products, userId: cart.userId }
      return cartDto
    } catch (error: any) {
      console.log(error)
      throw new InternalServerError()
    }
  }

  async DeleteCart(cartId: number): Promise<void> {
    try {
      const deleted = await cartRepository.deleteCart(cartId)
      if (!deleted) {
        throw new Error('Failed to delete cart')
      }
    } catch (error: any) {
      throw new Error(`Error deleting cart: ${error.message}`)
    }
  }

  async ClearCart(userId: number) {
    try {
      let cart = await cartRepository.findCartByUserId(userId)

      if (!cart) {
        let newCart = new Cart()
        newCart.userId = userId
        cart = await cartRepository.create(newCart)
        return true
      }
      await cartRepository.ClearCart(cart.id)
      return true
    } catch (ex) {
      console.log(ex)
      throw new InternalServerError()
    }
  }

  async AddProductToCart(userId: number, productId: number, quantity: number) {
    let product
    let cart
    try {
      cart = await cartRepository.findCartByUserId(userId)
      if (!cart) {
        let newCart = new Cart()
        newCart.userId = userId
        cart = await cartRepository.create(newCart)
      }
      product = await productRepository.findById(productId)
    } catch (error: any) {
      console.log(error)
      throw new InternalServerError()
    }

    //Ensure product exists
    if (!product)
      throw new NotFoundError('product with the specified id is not found')

    if (product.stock < 0 || product.stock < quantity)
      throw new InsufficientStockError(
        'Product either out of stock or does not satisfy the requested amount'
      )
    try {
      return await cartRepository.SetProductInCart(
        cart?.id,
        productId,
        quantity
      )
    } catch (error: any) {
      console.log(error)
      throw new InternalServerError()
    }
  }

  async removeProductFromCart(
    userId: number,
    productId: number
  ): Promise<void> {
    try {
      const cart = await cartRepository.findCartByUserId(userId)
      return await cartRepository.RemoveProductFromCart(cart?.id, productId)
    } catch (error: any) {
      console.log(error)
      throw new InternalServerError()
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
}
