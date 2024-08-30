import { UserRating } from '../models'
import { UserRatingDTO } from '../Types/DTO'
import { inject, injectable } from 'tsyringe'
import { userRatingRepository } from '../data-access'
import { InternalServerError } from '../Errors/InternalServerError'
import { ILogger } from '../helpers/Logger/ILogger'

@injectable()
export default class UserRatingService {
  constructor(@inject('ILogger') private logger: ILogger) {}

  public async createUserRating(
    userId: number,
    data: UserRatingDTO
  ): Promise<UserRatingDTO | null> {
    const { rating, productId } = data
    const userRating = new UserRating()
    userRating.userId = userId
    userRating.productId = productId
    userRating.rating = rating
    try {
      const oldUserRating = await userRatingRepository.findByUserIdAndProductId(
        userId,
        productId
      )
      if (oldUserRating) {
        return oldUserRating
      }
      await userRatingRepository.create(userRating)

      return data
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  public async findUserRatingsByProductId(productId: number): Promise<number> {
    try {
      const userRatings =
        await userRatingRepository.findAllByProductId(productId)
      if (!userRatings || userRatings.length === 0) {
        return 0
      }
      const rating =
        userRatings.reduce(
          (value, userRating) => value + userRating.dataValues.rating,
          0
        ) / userRatings.length
      return rating
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  public async findUserRatingByUserIdAndProductId(
    userId: number,
    productId: number
  ): Promise<UserRatingDTO | null> {
    try {
      const userRating = await userRatingRepository.findByUserIdAndProductId(
        userId,
        productId
      )
      if (!userRating) {
        return null
      }
      const res: UserRatingDTO = {
        rating: userRating.toJSON().rating,
        productId,
      }
      return res
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  public async updateUserRating(
    userId: number,
    data: UserRatingDTO
  ): Promise<UserRatingDTO | null> {
    const { rating, productId } = data
    const userRating = new UserRating()
    userRating.userId = userId
    userRating.rating = rating
    userRating.productId = productId
    try {
      const updatedUserRating =
        await userRatingRepository.updateUserRating(userRating)

      if (!updatedUserRating) {
        return null
      }
      return data
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }
}
