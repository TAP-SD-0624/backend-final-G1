import { CommentService } from '../services'
import { CommentDTO } from '../Types/DTO'
import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'
import { AuthenticatedRequest } from '../helpers/AuthenticatedRequest'
import { StatusCodes } from 'http-status-codes'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
import { InternalServerErrorResponse } from '../helpers/DefaultResponses/DefaultResponses'

@injectable()
export class CommentController {
  constructor(@inject(CommentService) private commentService: CommentService) {}

  public async createComment(req: AuthenticatedRequest, res: Response) {
    try {
      const commentData: CommentDTO = req.body

      const Comment = await this.commentService.createComment(
        req.user?.id,
        commentData
      )
      if (!Comment) {
        return res.status(StatusCodes.NOT_FOUND).send({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Product with the specified id not found',
        })
      }

      return res.status(StatusCodes.CREATED).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Comment,
      })
    } catch (error: unknown) {
      return InternalServerErrorResponse(res)
    }
  }

  public async updateComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params
      const commentData: CommentDTO = req.body

      const comment = await this.commentService.updateComment(
        id as unknown as number,
        req.user?.id,
        commentData
      )
      if (!comment) {
        return res.status(StatusCodes.NOT_FOUND).send({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Could not find a comment with the provided id',
        })
      }
      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Comment: commentData,
      })
    } catch (error: unknown) {
      return InternalServerErrorResponse(res)
    }
  }

  public async deleteComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params

      const isDeleted = await this.commentService.deleteComment(
        id as unknown as number,
        req.user?.id
      )
      if (!isDeleted) {
        return res.status(StatusCodes.NOT_FOUND).send({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Could not find a comment with the provided id',
        })
      }
      return res.status(StatusCodes.OK).send({
        ResponseCode: ResponseCodes.Success,
        Message: 'Successfully deleted the comment',
      })
    } catch (error: unknown) {
      return InternalServerErrorResponse(res)
    }
  }
}
