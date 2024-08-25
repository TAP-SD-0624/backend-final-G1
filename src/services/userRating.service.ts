import { UserRating } from '../models'
import { UserRatingDTO } from '../Types/DTO'
import { injectable } from 'tsyringe'
import { userRatingRepository } from '../data-access'
import logger from '../helpers/logger'
import { InternalServerError } from '../Errors/InternalServerError'

@injectable()
export class UserRatingService {
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
    } catch (error: any) {
      logger.error({
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
      throw new InternalServerError(
        'an error occurred, please try again later.'
      )
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
    } catch (error: any) {
      logger.error(error)
      throw new InternalServerError(
        'an error occurred, please try again later.'
      )
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
    } catch (error: any) {
      logger.error(error)
      throw new InternalServerError(
        'an error occurred, please try again later.'
      )
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
    } catch (error: any) {
      logger.error(error)
      throw new InternalServerError(
        'an error occurred, please try again later.'
      )
    }
  }
}
