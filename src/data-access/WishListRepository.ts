import { Brand, Product, Wishlist, WishlistProduct } from '../models'
import { IWishlistRepository as IWishlistRepository } from './Interfaces/IWishListRepository'
import { RepositoryBase } from './RepositoryBase'

export class WishlistRepository
  extends RepositoryBase<Wishlist>
  implements IWishlistRepository
{
  async clearWishList(userId: number): Promise<boolean> {
    const wishlist = await this.model.findOne({ where: { userId } })
    await wishlist!.$set('products', [])
    return true
  }
  async removeProductFromWishList(
    userId: number,
    productId: number
  ): Promise<boolean> {
    const wishlist = await Wishlist.findOne({ where: { userId } })
    const product = await WishlistProduct.findOne({
      where: { wishlistId: wishlist!.id, productId },
    })
    if (!product) {
      return false
    }
    await wishlist!.$remove('products', productId)

    return true
  }
  async addProductToWishlist(
    userId: number,
    productId: number
  ): Promise<boolean> {
    const wishlist = await Wishlist.findOne({ where: { userId } })
    const product = await Product.findByPk(productId)
    const existedProduct = await WishlistProduct.findOne({
      where: { wishlistId: wishlist!.dataValues.id, productId },
      paranoid: false,
    })
    if (!product) {
      return false
    }
    if (existedProduct) {
      await existedProduct.restore()
      return true
    }
    await wishlist!.$add('products', productId)
    return true
  }
  async findByUserId(userId: number): Promise<Wishlist | null> {
    return await Wishlist.findOne({
      attributes: [],
      where: { userId },
      include: [
        {
          attributes: ['name', 'description', 'price', 'stock'],
          model: Product,
          include: [
            {
              model: Brand,
            },
          ],
        },
      ],
    })
  }
  async wishlistExists(userId: number): Promise<boolean> {
    const wishlist = await this.model.findOne({ where: { userId } })
    if (wishlist) {
      return true
    }
    return false
  }
}
