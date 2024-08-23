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

commentRouter.use(authAndRoleMiddleware(['user']))
commentRouter.post(
  '/',
  createCommentValidator,
  commentController.createComment.bind(commentController)
)
commentRouter.patch(
  '/:id',
  updateCommentValidator,
  commentController.updateComment.bind(commentController)
)
commentRouter.delete(
  '/:id',
  deleteCommentValidator,
  commentController.deleteComment.bind(commentController)
)

export default commentRouter
