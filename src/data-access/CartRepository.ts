import { Cart, CartProduct, Product } from '../models'
import { ICartRepository } from './Interfaces/ICartRepository'
import { RepositoryBase } from './RepositoryBase'
import sequelize from '../config/db'

export class CartRepository
  extends RepositoryBase<Cart>
  implements ICartRepository
{
  /**
   * retrieve a cart with the specified Userid.
   * @param {number} userId - this is the id of the user we want to retrieve their cart from our Database.
   * @returns {Cart[] | null} returns the cart identified with the userId, if not found returns null.
   * @throws {Error} when it fails to retrieve from or connect with the database.
   */
  async findCartByUserId(userId: number): Promise<Cart[]> {
    return await this.model.findAll({ where: { userId } })
  }

  /**
   * retrieve products for a specific cart
   * @param {number} cartId - this is the id of the cart we want to retrieve its products from our Database.
   * @returns {Cart | null} returns the cart identified with the cartId, if not found returns null.
   * @throws {Error} when it fails to retrieve from or connect with the database.
   */
  async findCartProducts(cartId: number): Promise<Cart | null> {
    return await this.model.findByPk(cartId, {
      include: { all: true },
    })
  }

  /**
   * Update a cart with the specified cartId.
   * @param {number} id - this is the id of the cart we want to update
   * @returns {Cart | null} returns the updated cart identified with the cartId, if not found returns null.
   * @throws {Error} when it fails to retrieve from or connect with the database.
   */
  async updateCart(id: number, cartData: Cart): Promise<Cart | null> {
    const [affectedRows, [updatedCart]] = await this.model.update(cartData, {
      where: { id },
      returning: true,
    })
    return affectedRows > 0 ? updatedCart : null
  }

  /**
   * delete a cart with the specified Userid.
   * @param {number} id - this is the id of the cart we want to delete from our Database.
   * @returns {boolean} returns true if the cart is deleted otherwise it returns false
   * @throws {Error} when it fails to retrieve from or connect with the database.
   */
  async deleteCart(id: number): Promise<boolean> {
    const deleted = await this.model.destroy({ where: { id } })
    return deleted > 0
  }

  /**
   * Adds a product to the cart.
   * @param {number} cartId - The ID of the cart.
   * @param {number} productId - The ID of the product.
   * @param {number} quantity - The quantity of the product to add.
   * @returns {Promise<boolean>} - Returns true if the product is added successfully, otherwise false.
   * @throws {Error} - Throws an error if the cart or product is not found, if the product is already in the cart, or if the requested quantity exceeds available stock.
   */
  async addProductToCart(
    cartId: number,
    productId: number,
    quantity: number
  ): Promise<boolean> {
    return await sequelize.transaction(async (transaction) => {
      // Step 1: Find the cart
      const cart = await this.model.findByPk(cartId, { transaction })
      if (!cart) {
        throw new Error(`Cart with ID ${cartId} not found`)
      }

      // Step 2: Check if the product exists
      const productData = await Product.findByPk(productId, { transaction })
      if (!productData) {
        throw new Error(`Product with ID ${productId} not found`)
      }

      // check if the product is exist
      if (productData.stock < 1) {
        throw new Error(`Product with ID ${productId} is out of stock`)
      }

      // Step 3: Check if the product is already in the cart
      const productInCart = await cart.$has('products', productId, {
        transaction,
      })
      if (productInCart) {
        throw new Error(`Product with ID ${productId} is already in the cart`)
      }

      // Step 4: Check if the requested quantity exceeds the available stock
      if (productData.stock < quantity) {
        throw new Error(
          `Requested quantity ${quantity} exceeds available stock of ${productData.stock}`
        )
      }

      // Step 5: Decrease the stock of the product
      productData.stock -= quantity
      await productData.save({ transaction })

      // Step 6: Add the product to the cart with the specified quantity
      await cart.$add('products', productId, {
        through: { quantity },
        transaction,
      })

      return true
    })
  }

  /**
   * remove a product from a cart
   * @params {number, number} cartId, productId
   * @returns {boolean} returns true if the product removed successfully, otherwise returns false
   * @throws {Error} when it fails to retrieve from or connect with the database.
   */
  async removeProductFromCart(
    cartId: number,
    productId: number
  ): Promise<boolean> {
    return await sequelize.transaction(async (transaction) => {
      // Step 1: Find the cart
      const cart = await this.model.findByPk(cartId, { transaction })
      if (!cart) {
        throw new Error('Cart not found')
      }
      // Step 2: Ensure the product is in the cart
      const productInCart = await cart.$has('products', productId, {
        transaction,
      })
      if (!productInCart) {
        throw new Error('Product not found in cart')
      }
      // Step 3: Remove the product from the cart
      await cart.$remove('products', productId, { transaction })
      // increase the stock of the product
      const productData = await Product.findByPk(productId, { transaction })
      if (!productData) {
        throw new Error('Product not found')
      }
      productData.stock += 1
      await productData.save({ transaction })
      return true
    })
  }

  /**
   * update the quantity of the product
   * @params {number,number,number} cartId, productId, quantity - cartId is the id of the cart, productId is the product we want to update it's quantity
   * @returns {boolean} returns true if the quantity is updated successfully otherwise, false
   * @throws {Error} when it fails to retrieve from or connect with the database.
   */
  async updateProductQuantity(
    cartId: number,
    productId: number,
    quantity: number
  ): Promise<boolean> {
    console.log(
      `Updating product quantity for cartId: ${cartId}, productId: ${productId}, quantity: ${quantity}`
    )
    // Step 1: Find the cart by its primary key
    const cart = await this.model.findByPk(cartId)
    if (!cart) {
      console.log(`Cart with ID ${cartId} not found`)
      throw new Error('Cart not found')
    }
    // Step 2: Find the CartProduct entry
    const cartProduct = await CartProduct.findOne({
      where: {
        cartId: cartId,
        productId: productId,
      },
    })
    if (!cartProduct) {
      console.log(
        `Product with ID ${productId} not found in cart with ID ${cartId}`
      )
      throw new Error('Product not found in cart')
    }
    // Step 3: Update the quantity of the product in the cart
    cartProduct.quantity = quantity
    await cartProduct.save()
    console.log(
      `Successfully updated quantity for productId: ${productId} in cartId: ${cartId} to ${quantity}`
    )
    return true
  }

  async findCartProductByUserId(userId: number): Promise<Cart[] | null> {
    return await this.model.findAll({
      where: { userId },
      include: [
        {
          association: 'products',
          through: { attributes: [] },
        },
      ],
    })
  }

  // get cart product by cart id
  async findCartProductById(cartId: number): Promise<Cart | null> {
    return await this.model.findByPk(cartId, {
      include: [
        {
          association: 'products',
          through: { attributes: [] },
        },
      ],
    })
  }
}
