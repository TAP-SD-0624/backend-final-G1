import { Comment, User, UserRating } from '../models'
import { ICommentRepository } from './Interfaces/ICommentRepository'
import { RepositoryBase } from './RepositoryBase'

export class CommentRepository
  extends RepositoryBase<Comment>
  implements ICommentRepository
{
  /**
   *
   * @param productId Id for the product we want to retrieve all comments for.
   * @returns {Comment[]} returns list of comments for the specified product, return  empty array when there is none.
   */
  async findByProductId(productId: number): Promise<Comment[]> {
    return await this.model.findAll({
      where: { productId },
      include: [
        {
          model: User,
          include: [
            {
              model: UserRating,
              where: {
                productId,
              },
            },
          ],
        },
      ],
    })
  }

  async findByUserIdAndId(userId: number, id: number): Promise<Comment | null> {
    return await this.model.findOne({ where: { id, userId } })
  }
}
