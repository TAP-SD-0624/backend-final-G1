import { UserRating } from '../models'
import { IUserRatingRepository } from './Interfaces/IUserRatingRepository'
import { RepositoryBase } from './RepositoryBase'

export class UserRatingRepository
  extends RepositoryBase<UserRating>
  implements IUserRatingRepository {
  async findAllByProductId(productId: number): Promise<UserRating[] | null> {
    return await this.model.findAll({ where: { productId: productId } })
  }
  async findByUserIdAndProductId(
    userId: number,
    productId: number
  ): Promise<UserRating | null> {
    return await this.model.findOne({
      attributes: { exclude: ['userId', 'productId'] },
      where: { userId: userId, productId: productId },
    })
  }
  async updateUserRating(entity: UserRating): Promise<UserRating | null> {
    const [_, [updatedEntity]] = await this.model.update({ rating: entity.dataValues.rating }, {
      where: { userId: entity.dataValues.userId, productId: entity.dataValues.productId },
      returning: true,
    })
    return updatedEntity
  }
}
