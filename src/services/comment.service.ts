import { Comment } from '../models'
import { CommentDTO } from '../Types/DTO/commentDto'
import { injectable } from 'tsyringe'
import { commentRepository, productRepository } from '../data-access'
import { InternalServerError } from '../Errors/InternalServerError'
import logger from '../helpers/logger'
@injectable()
export default class CommentService {
  /**
   *
   * @param {number} userId Id of the user creating the comment.
   * @param {CommentDTO} data data associated with the comment.
   * @returns {Comment} when it successfully creates a comment.
   * @returns {null} null when the product isn't found.
   * @throws {InternalServerError} InternalServerError when fails to continue the request.
   */
  public async createComment(
    userId: number,
    data: CommentDTO
  ): Promise<CommentDTO | null> {
    try {
      const { content, productId } = data

      const status = await productRepository.GetProduct(productId)
      if (!status) return null

      const newComment = new Comment()
      newComment.userId = userId
      newComment.content = content
      newComment.productId = productId

      await commentRepository.create(newComment)
      return data
    } catch (error: any) {
      logger.error(error)
      throw new InternalServerError('an error occurred, please try again later')
    }
  }

  public async getCommentsByProductId(
    productId: number
  ): Promise<CommentDTO[] | null> {
    try {
      const comments = await commentRepository.findByProductId(productId)
      if (!comments) {
        return null
      }
      const commentsJSON = comments.map((comment) => comment.toJSON())
      const commentsDTO: CommentDTO[] = commentsJSON
      return commentsDTO
    } catch (error: any) {
      logger.error(error)
      throw new InternalServerError('an error occurred, please try again later')
    }
  }

  public async getCommentById(id: number): Promise<CommentDTO | null> {
    try {
      const comment = await commentRepository.findById(id)
      if (!comment) {
        return null
      }
      const comm: CommentDTO = comment.toJSON()
      return comm
    } catch (error: any) {
      logger.error(error)
      throw new InternalServerError('an error occurred, please try again later')
    }
  }

  public async updateComment(
    id: number,
    userId: number,
    data: Partial<CommentDTO>
  ): Promise<Comment | null> {
    const comment = new Comment()
    comment.id = id
    comment.userId = userId
    if (data.content) comment.content = data.content
    try {
      const updatedComment = await commentRepository.update(comment)
      if (!updatedComment) {
        return null
      }
      const commentJson = updatedComment.toJSON()
      return commentJson
    } catch (error: any) {
      logger.error(error)
      throw new InternalServerError('an error occurred, please try again later')
    }
  }

  public async deleteComment(id: number, userId: number): Promise<boolean> {
    try {
      const comment = await commentRepository.findByUserIdAndId(userId, id)
      if (!comment) {
        return false
      }
      return await commentRepository.delete(id)
    } catch (error: any) {
      logger.error(error)
      throw new InternalServerError('an error occurred, please try again later')
    }
  }
}
