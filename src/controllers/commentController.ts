import { CommentService } from '../services'
import { CommentDTO } from '../Types/DTO'
import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'

@injectable()
export class CommentController {
  constructor(@inject(CommentService) private commentService: CommentService) {}

  public async createComment(req: Request, res: Response) {
    try {
      const commentData: CommentDTO = req.body

      const comment = await this.commentService.createComment(
        (req as any).user.id,
        commentData
      )
      if (!comment) {
        return res.status(404).send('product not found')
      }
      return res.status(201).json(comment)
    } catch (error: any) {
      res
        .status(500)
        .json({ error: 'Internal server error, please try again alter' })
    }
  }

  public async updateComment(req: Request, res: Response) {
    try {
      const id = req.params.id as unknown as number
      const commentData: CommentDTO = req.body
      const userId = (req as any).user.id
      const comment = await this.commentService.updateComment(
        id,
        userId,
        commentData
      )
      if (!comment) {
        return res.status(404).send('comment not found')
      }
      return res.status(200).json(commentData)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  public async deleteComment(req: Request, res: Response) {
    try {
      const id = req.params.id as unknown as number

      const userId = (req as any).user.id
      const isDeleted = await this.commentService.deleteComment(id, userId)
      if (!isDeleted) {
        return res.status(404).send('comment not found')
      }
      return res.status(204).send('comment has been deleted')
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
