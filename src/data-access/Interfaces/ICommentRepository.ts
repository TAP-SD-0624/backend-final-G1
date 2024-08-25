import { Comment } from '../../models'
import { IRepositoryBase } from './IRepositoryBase'

export interface ICommentRepository extends IRepositoryBase<Comment> {
  findByProductId(productId: number): Promise<Comment[]>
  findByUserIdAndId(userId: number, id: number): Promise<Comment | null>
}
