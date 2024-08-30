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
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  public async addProductToWishlist(
    userId: number,
    productId: number
  ): Promise<boolean> {
    try {
      return await wishlistRepository.addProductToWishlist(userId, productId)
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  public async clearWishList(id: number): Promise<boolean> {
    try {
      return await wishlistRepository.clearWishList(id)
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
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
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }
}
