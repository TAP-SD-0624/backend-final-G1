import { UserRatingService } from '../services'
import { UserRatingDTO } from '../Types/DTO'
import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'

@injectable()
export class UserRatingController {
  constructor(
    @inject(UserRatingService) private userRatingService: UserRatingService
  ) {}

  public async createUserRating(req: Request, res: Response) {
    try {
      const userRatingData: UserRatingDTO = req.body
      const userId = (req as any).user.id
      const userRating = await this.userRatingService.createUserRating(
        userId,
        userRatingData
      )
      res.status(201).json(userRating)
    } catch (error: any) {
      res.status(500).send({ error: error.message })
      throw error
    }
  }

  public async updateUserRating(req: Request, res: Response) {
    try {
      const userRatingData: UserRatingDTO = req.body
      const userId = (req as any).user.id
      const userRating = await this.userRatingService.updateUserRating(
        userId,
        userRatingData
      )
      if (!userRating) {
        return res.status(404).send('User Rating not found')
      }
      return res.status(200).json(userRating)
    } catch (error: any) {
      res.status(500)
      throw error
    }
  }

  public async findByUserIdAndProductId(req: Request, res: Response) {
    try {
      const id = req.params.id as unknown as number

      const userId = (req as any).user.id
      const userRating =
        await this.userRatingService.findUserRatingByUserIdAndProductId(
          id,
          userId
        )
      if (!userRating) {
        res.status(404).send('User Rating not found')
      }
      res.json(userRating)
    } catch (error: any) {
      res.status(500).send({ error: error.message })
      throw error
    }
  }
}
