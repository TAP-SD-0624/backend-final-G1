import { Cart, CartProduct, Product } from '../models'
import { ICartRepository } from './Interfaces/ICartRepository'
import { RepositoryBase } from './RepositoryBase'
import sequelize from '../config/db'

export class CartRepository
  extends RepositoryBase<Cart>
  implements ICartRepository {
  async findCartByUserId(userId: number): Promise<Cart[]> {
    return await this.model.findAll({ where: { userId } })
  }
  async findCartProducts(cartId: number): Promise<Cart | null> {
    return await this.model.findByPk(cartId, {
      include: { all: true },
    })
  }

  async updateCart(id: number, cartData: Cart): Promise<Cart | null> {
    const [affectedRows, [updatedCart]] = await this.model.update(cartData, {
      where: { id },
      returning: true,
    })
    return affectedRows > 0 ? updatedCart : null
  }

  async deleteCart(id: number): Promise<boolean> {
    const deleted = await this.model.destroy({ where: { id } })
    return deleted > 0
  }

  // add product to cart
  async addProductToCart(
    cartId: number,
    productId: number,
    quantity: number
  ): Promise<boolean> {
    return await sequelize.transaction(async (transaction) => {
      // Step 1: Find the cart
      const cart = await this.model.findByPk(cartId, { transaction })
      if (!cart) {
        throw new Error('Cart not found')
      }
      // Step 2: Check if the product exists
      const productData = await Product.findByPk(productId, { transaction })
      if (!productData) {
        throw new Error('Product not found')
      }
      // Step 3: Check if the product is already in the cart
      const productInCart = await cart.$has('products', productId, {
        transaction,
      })
      if (productInCart) {
        throw new Error('Product already in cart')
      }
      // Step 4: Check if the requested quantity exceeds the available stock
      if (productData.stock < quantity) {
        throw new Error('Quantity exceeds available stock')
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

  // remove item from cart
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

  // update product quantity in cart
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

  // function that takes userId and return the cart with the products
  async getCartWithProducts(userId: number): Promise<Cart | null> {
    return await this.model.findOne({
      where: { userId },
      include: [
        {
          association: 'products',  
          through: { attributes: [] },  
        }
      ],
    });
  }
}