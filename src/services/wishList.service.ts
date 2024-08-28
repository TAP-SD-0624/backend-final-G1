import 'reflect-metadata'
import { inject, injectable } from 'tsyringe'
import { wishlistRepository } from '../data-access'
import { WishlistDTO } from '../Types/DTO'
import { InternalServerError } from '../Errors/InternalServerError'
import { ILogger } from '../helpers/Logger/ILogger'

@injectable()
export default class WishlistService {
  constructor(@inject('ILogger') private logger: ILogger) {}

  public async getWishlistByUserId(
    userId: number
  ): Promise<WishlistDTO | null> {
    try {
      const wishlist = await wishlistRepository.findByUserId(userId)
      return wishlist
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError(
        'an error occurred, please try again later.'
      )
    }
  }

  public async addProductToWishlist(
    userId: number,
    productId: number
  ): Promise<boolean> {
    try {
      return await wishlistRepository.addProductToWishlist(userId, productId)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError(
        'an error occurred, please try again later.'
      )
    }
  }

  public async clearWishList(id: number): Promise<boolean> {
    try {
      return await wishlistRepository.clearWishList(id)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError(
        'an error occurred, please try again later.'
      )
    }
  }

  public async removeProductFromWishList(
    userId: number,
    productId: number
  ): Promise<boolean> {
    try {
      return await wishlistRepository.removeProductFromWishList(
        userId,
        productId
      )
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError(
        'an error occurred, please try again later.'
      )
    }
  }
}
