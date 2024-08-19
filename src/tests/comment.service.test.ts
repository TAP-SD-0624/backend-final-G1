import 'reflect-metadata'
import CommentService from '../services/comment.service'
import { commentRepository, productRepository } from '../data-access'
import { CommentDTO } from '../Types/DTO/commentDto'
import { InternalServerError } from '../Errors/InternalServerError'
import logger from '../helpers/logger'
import { Comment } from '../models'

jest.mock('../data-access/commentRepository')
jest.mock('../data-access/productRepository')
jest.mock('../helpers/logger')

describe('CommentService', () => {
  let commentService: CommentService

  beforeEach(() => {
    commentService = new CommentService()
    jest.clearAllMocks()
  })

  describe('createComment', () => {
    it('should create and return a comment when the product exists', async () => {
      const userId = 1
      const commentData: CommentDTO = {
        productId: 123,
        content: 'Great product!',
      }

      ;(productRepository.GetProduct as jest.Mock).mockResolvedValue(true)
      ;(commentRepository.create as jest.Mock).mockResolvedValue(commentData)

      const result = await commentService.createComment(userId, commentData)

      expect(productRepository.GetProduct).toHaveBeenCalledWith(
        commentData.productId
      )
      expect(commentRepository.create).toHaveBeenCalledWith(expect.anything())
      expect(result).toEqual(commentData)
    })

    it('should return null if the product does not exist', async () => {
      const userId = 1
      const commentData: CommentDTO = {
        productId: 123,
        content: 'Great product!',
      }

      ;(productRepository.GetProduct as jest.Mock).mockResolvedValue(false)

      const result = await commentService.createComment(userId, commentData)

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const userId = 1
      const commentData: CommentDTO = {
        productId: 123,
        content: 'Great product!',
      }

      ;(productRepository.GetProduct as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        commentService.createComment(userId, commentData)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('getCommentsByProductId', () => {
    it('should return a list of comments for a product', async () => {
      const productId = 123
      const comments: Comment[] = [new Comment()]
      comments[0].id = 1
      comments[0].userId = 1
      comments[0].productId = 123
      comments[0].content = 'Great product!'

      const resultComments = [
        { id: 1, userId: 1, productId: 123, content: 'Great product!' },
      ]

      ;(commentRepository.findByProductId as jest.Mock).mockResolvedValue(
        comments
      )

      const result = await commentService.getCommentsByProductId(productId)

      expect(commentRepository.findByProductId).toHaveBeenCalledWith(productId)
      expect(result).toEqual(resultComments)
    })

    it('should return empty array if no comments are found', async () => {
      const productId = 123

      ;(commentRepository.findByProductId as jest.Mock).mockResolvedValue([])

      const result = await commentService.getCommentsByProductId(productId)

      expect(result).toEqual([])
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const productId = 123

      ;(commentRepository.findByProductId as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        commentService.getCommentsByProductId(productId)
      ).rejects.toThrow(InternalServerError)
    })
  })

  describe('getCommentById', () => {
    it('should return a comment by its ID', async () => {
      const commentId = 1
      const comment: CommentDTO = {
        id: 1,
        userId: 1,
        productId: 123,
        content: 'Great product!',
      }

      ;(commentRepository.findById as jest.Mock).mockResolvedValue({
        toJSON: () => comment,
      })

      const result = await commentService.getCommentById(commentId)

      expect(commentRepository.findById).toHaveBeenCalledWith(commentId)
      expect(result).toEqual(comment)
    })

    it('should return null if the comment is not found', async () => {
      const commentId = 1

      ;(commentRepository.findById as jest.Mock).mockResolvedValue(null)

      const result = await commentService.getCommentById(commentId)

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const commentId = 1

      ;(commentRepository.findById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(commentService.getCommentById(commentId)).rejects.toThrow(
        InternalServerError
      )
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('updateComment', () => {
    it('should update and return the updated comment', async () => {
      const commentId = 1
      const userId = 1
      const updateData: Partial<CommentDTO> = { content: 'Updated content' }
      const updatedComment: CommentDTO = {
        id: 1,
        userId: 1,
        productId: 123,
        content: 'Updated content',
      }

      ;(commentRepository.update as jest.Mock).mockResolvedValue({
        toJSON: () => updatedComment,
      })

      const result = await commentService.updateComment(
        commentId,
        userId,
        updateData
      )

      expect(commentRepository.update).toHaveBeenCalledWith(expect.anything())
      expect(result).toEqual(updatedComment)
    })

    it('should return null if the comment is not found', async () => {
      const commentId = 1
      const userId = 1
      const updateData: Partial<CommentDTO> = { content: 'Updated content' }

      ;(commentRepository.update as jest.Mock).mockResolvedValue(null)

      const result = await commentService.updateComment(
        commentId,
        userId,
        updateData
      )

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const commentId = 1
      const userId = 1
      const updateData: Partial<CommentDTO> = { content: 'Updated content' }

      ;(commentRepository.update as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        commentService.updateComment(commentId, userId, updateData)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('deleteComment', () => {
    it('should delete the comment and return true', async () => {
      const commentId = 1
      const userId = 1

      ;(commentRepository.findByUserIdAndId as jest.Mock).mockResolvedValue({
        id: commentId,
        userId,
      })
      ;(commentRepository.delete as jest.Mock).mockResolvedValue(true)

      const result = await commentService.deleteComment(commentId, userId)

      expect(commentRepository.findByUserIdAndId).toHaveBeenCalledWith(
        userId,
        commentId
      )
      expect(commentRepository.delete).toHaveBeenCalledWith(commentId)
      expect(result).toBe(true)
    })

    it('should return false if the comment is not found', async () => {
      const commentId = 1
      const userId = 1

      ;(commentRepository.findByUserIdAndId as jest.Mock).mockResolvedValue(
        null
      )

      const result = await commentService.deleteComment(commentId, userId)

      expect(result).toBe(false)
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const commentId = 1
      const userId = 1

      ;(commentRepository.findByUserIdAndId as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        commentService.deleteComment(commentId, userId)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalled()
    })
  })
})
