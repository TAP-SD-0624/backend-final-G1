import { Wishlist } from '../../models'
import { IRepositoryBase } from './IRepositoryBase'

export interface IWishlistRepository extends IRepositoryBase<Wishlist> {
  findByUserId(userId: number): Promise<Wishlist | null>
  addProductToWishlist(userId: number, productId: number): Promise<boolean>
  clearWishList(userId: number): Promise<boolean>
  removeProductFromWishList(userId: number, productId: number): Promise<boolean>
  wishlistExists(userId: number): Promise<boolean>
}
