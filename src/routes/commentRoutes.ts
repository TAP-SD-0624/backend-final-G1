import { Router } from 'express'
import { container } from 'tsyringe'
import { CommentController } from '../controllers'
import {
  createCommentValidator,
  updateCommentValidator,
  deleteCommentValidator,
} from '../validations'
import authAndRoleMiddleware from '../middleware/authMiddleware'

const commentRouter = Router()
const commentController = container.resolve(CommentController)

commentRouter.post(
  '/',
  authAndRoleMiddleware(['user']),
  createCommentValidator,
  commentController.createComment.bind(commentController)
)
commentRouter.patch(
  '/:id',
  authAndRoleMiddleware(['user']),
  updateCommentValidator,
  commentController.updateComment.bind(commentController)
)
commentRouter.delete(
  '/:id',
  authAndRoleMiddleware(['user']),
  deleteCommentValidator,
  commentController.deleteComment.bind(commentController)
)

export default commentRouter
