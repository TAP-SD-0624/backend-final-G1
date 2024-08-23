import { UserRating } from '../../models'
import { IRepositoryBase } from './IRepositoryBase'
export interface IUserRatingRepository extends IRepositoryBase<UserRating> {
  findAllByProductId(productId: number): Promise<UserRating[] | null>
  findByUserIdAndProductId(
    userId: number,
    productId: number
  ): Promise<UserRating | null>

}
