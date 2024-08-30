import { UserRatingService } from '../services'
import { UserRatingDTO } from '../Types/DTO'
import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
import { InternalServerErrorResponse } from '../helpers/DefaultResponses/DefaultResponses'
import { AuthenticatedRequest } from '../helpers/AuthenticatedRequest'

@injectable()
export class UserRatingController {
  constructor(
    @inject(UserRatingService) private userRatingService: UserRatingService
  ) {}

  public async createUserRating(req: AuthenticatedRequest, res: Response) {
    try {
      const userRatingData: UserRatingDTO = req.body
      const userId = req.user?.id
      const Rating = await this.userRatingService.createUserRating(
        userId,
        userRatingData
      )
      res.status(StatusCodes.CREATED).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Created successfully',
        Rating,
      })
    } catch (error: unknown) {
      return InternalServerErrorResponse(res)
    }
  }

  public async updateUserRating(req: AuthenticatedRequest, res: Response) {
    try {
      const userRatingData: UserRatingDTO = req.body
      const userId = req.user?.id
      const Rating = await this.userRatingService.updateUserRating(
        userId,
        userRatingData
      )
      if (!Rating) {
        return res.status(404).send('User Rating not found')
      }
      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Updated successfully',
        Rating,
      })
    } catch (error: unknown) {
      return InternalServerErrorResponse(res)
    }
  }

  public async findByUserIdAndProductId(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const id = req.params.id as unknown as number

      const userId = req.user?.id
      const Rating =
        await this.userRatingService.findUserRatingByUserIdAndProductId(
          id,
          userId
        )
      if (!Rating) {
        res.status(StatusCodes.NOT_FOUND).send({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'could not find the rating for the user.',
        })
      }
      res.json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Rating,
      })
    } catch (error: unknown) {
      return InternalServerErrorResponse(res)
    }
  }
}
