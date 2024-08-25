import { Brand, Cart, CartProduct, Product, ProductCategory } from '../models'
import { ICartRepository } from './Interfaces/ICartRepository'
import { RepositoryBase } from './RepositoryBase'
import sequelize from '../config/db'

export class CartRepository
  extends RepositoryBase<Cart>
  implements ICartRepository
{
  /**
   * retrieve a cart with the specified UserId.
   * @param {number} userId - The id of the user we want to retrieve their cart from our Database.
   * @returns {Promise<Cart[]>} Returns the cart identified with the userId, if not found returns an empty array.
   * @throws {Error} Throws an error when it fails to retrieve from or connect with the database.
   */

  async findCartByUserId(userId: number): Promise<Cart | null> {
    return await this.model.findOne({
      where: { userId },
      include: [{ model: Product, include: [{ model: Brand }] }],
    })
  }

  /**
   * retrieve products for a specific cart.
   * @param {number} cartId - The id of the cart we want to retrieve its products from our Database.
   * @returns {Promise<Cart | null>} Returns the cart identified with the cartId, if not found returns null.
   * @throws {Error} Throws an error when it fails to retrieve from or connect with the database.
   */
  async findCartProducts(cartId: number): Promise<Cart | null> {
    try {
      return await this.model.findByPk(cartId, {
        include: { all: true },
      })
    } catch (error) {
      console.error(`Failed to find cart products for cartId ${cartId}:`, error)
      throw new Error('Error retrieving cart products from the database.')
    }
  }

  /**
   * Update a cart with the specified cartId.
   * @param {number} id - The id of the cart we want to update.
   * @param {Cart} cartData - The updated cart data.
   * @returns {Promise<Cart | null>} Returns the updated cart identified with the cartId, if not found returns null.
   * @throws {Error} Throws an error when it fails to update the cart in the database.
   */
  async updateCart(id: number, cartData: Cart): Promise<Cart | null> {
    try {
      const [affectedRows, [updatedCart]] = await this.model.update(cartData, {
        where: { id },
        returning: true,
      })
      return affectedRows > 0 ? updatedCart : null
    } catch (error) {
      console.error(`Failed to update cart with ID ${id}:`, error)
      throw new Error('Error updating the cart in the database.')
    }
  }

  /**
   * delete a cart with the specified cartId.
   * @param {number} id - The id of the cart we want to delete from our Database.
   * @returns {Promise<boolean>} Returns true if the cart is deleted otherwise it returns false.
   * @throws {Error} Throws an error when it fails to delete the cart from the database.
   */
  async deleteCart(id: number): Promise<boolean> {
    try {
      const deleted = await this.model.destroy({ where: { id } })
      return deleted > 0
    } catch (error) {
      console.error(`Failed to delete cart with ID ${id}:`, error)
      throw new Error('Error deleting the cart from the database.')
    }
  }

  /**
   * Adds a product to the cart.
   * @param {number} cartId - The ID of the cart.
   * @param {number} productId - The ID of the product.
   * @param {number} quantity - The quantity of the product to add.

   * @throws {Error} - Throws an error if the cart or product is not found, if the product is already in the cart, or if the requested quantity exceeds available stock.
   */
  async SetProductInCart(cartId: number, productId: number, quantity: number) {
    let product = await CartProduct.findOne({
      where: { cartId, productId },
      paranoid: false,
    })

    if (!product) {
      const CT = new CartProduct()
      CT.productId = productId
      CT.cartId = cartId
      CT.quantity = quantity
      console.log(CT)
      product = await CartProduct.create(CT.dataValues)
    } else {
      await product.restore()
      product.set('quantity', quantity)
      await product.save()
    }
    return product
  }

  /**

   * remove a product from a cart
   * @params {number, number} cartId, productId
   * @throws {Error} when it fails to retrieve from or connect with the database.
   */
  async RemoveProductFromCart(cartId: number, productId: number) {
    await CartProduct.destroy({ where: { cartId, productId } })
  }

  /**
   * Update the quantity of a product in the cart.
   * @param {number} cartId - The ID of the cart.
   * @param {number} productId - The ID of the product.
   * @param {number} quantity - The new quantity of the product.
   * @returns {Promise<boolean>} Returns true if the quantity is updated successfully, otherwise false.
   * @throws {Error} Throws an error if the cart or product is not found.
   */
  async updateProductQuantity(
    cartId: number,
    productId: number,
    quantity: number
  ): Promise<boolean> {
    try {
      const cart = await this.findCartById(cartId)
      const cartProduct = await CartProduct.findOne({
        where: {
          cartId: cartId,
          productId: productId,
        },
      })
      if (!cartProduct) {
        throw new Error('Product not found in cart')
      }

      cartProduct.quantity = quantity
      await cartProduct.save()

      return true
    } catch (error) {
      console.error(
        `Failed to update quantity for productId: ${productId} in cartId: ${cartId}:`,
        error
      )
      throw new Error('Error updating product quantity in the cart.')
    }
  }

  /**
   * Find all products in a user's cart.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Cart[]> | null} Returns the cart identified with the userId, if not found returns null.
   * @throws {Error} Throws an error if it fails to retrieve from the database.
   */
  async findCartProductByUserId(userId: number): Promise<Cart[] | null> {
    try {
      return await this.model.findAll({
        where: { userId },
        include: [
          {
            association: 'products',
            through: { attributes: [] },
          },
        ],
      })
    } catch (error) {
      console.error(
        `Failed to find products in cart for userId: ${userId}:`,
        error
      )
      throw new Error('Error retrieving products in cart from the database.')
    }
  }

  /**
   * Get cart products by cart ID.
   * @param {number} cartId - The ID of the cart.
   * @returns {Promise<Cart | null>} Returns the cart identified with the cartId, if not found returns null.
   * @throws {Error} Throws an error if it fails to retrieve from the database.
   */
  async findCartProductById(cartId: number): Promise<Cart | null> {
    try {
      return await this.model.findByPk(cartId, {
        include: [
          {
            association: 'products',
            through: { attributes: [] },
          },
        ],
      })
    } catch (error) {
      console.error(
        `Failed to find products in cart with ID: ${cartId}:`,
        error
      )
      throw new Error('Error retrieving products in cart from the database.')
    }
  }

  /**
   * Helper method to find a cart by ID.
   * @param {number} cartId - The ID of the cart.
   * @param {Transaction} [transaction] - Optional transaction object.
   * @returns {Promise<Cart>} Returns the cart found by ID.
   * @throws {Error} Throws an error if the cart is not found.
   */
  private async findCartById(cartId: number, transaction?: any): Promise<Cart> {
    const cart = await this.model.findByPk(cartId, { transaction })
    if (!cart) {
      throw new Error(`Cart with ID ${cartId} not found`)
    }
    return cart
  }

  /**
   * Helper method to find a product by ID.
   * @param {number} productId - The ID of the product.
   * @param {Transaction} [transaction] - Optional transaction object.
   * @returns {Promise<Product>} Returns the product found by ID.
   * @throws {Error} Throws an error if the product is not found.
   */
  private async findProductById(
    productId: number,
    transaction?: any
  ): Promise<Product> {
    const product = await Product.findByPk(productId, { transaction })
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`)
    }
    return product
  }

  async ClearCart(cartId: number) {
    const cart = await this.model.findByPk(cartId)
    cart?.$set('products', [])
  }
}
