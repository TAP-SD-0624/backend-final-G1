import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'
import { DashboardService } from '../services'
import { StatusCodes } from 'http-status-codes'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
import { InternalServerErrorResponse } from '../helpers/DefaultResponses/DefaultResponses'

@injectable()
export class DashboardController {
  constructor(
    @inject(DashboardService) private dashboardService: DashboardService
  ) {}

  public async getMostBoughtProductsOverTime(req: Request, res: Response) {
    const startTime = req.query.startTime as unknown as Date
    const endTime = req.query.endTime as unknown as Date
    try {
      const Products =
        await this.dashboardService.getMostBoughtProductsOverTime(
          startTime,
          endTime
        )

      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Products,
      })
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }

  public async getProductsNotBought(req: Request, res: Response) {
    const startTime = req.query.startTime as unknown as Date
    const endTime = req.query.endTime as unknown as Date
    try {
      const Products = await this.dashboardService.getProductsNotBought(
        startTime,
        endTime
      )

      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Products,
      })
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }

  public async DropItemsFromList(req: Request, res: Response) {
    const ids = req.body.ids as unknown as number[]
    try {
      const count = await this.dashboardService.DropItemsFromList(ids)
      if (!count) {
        return res.status(StatusCodes.NOT_FOUND).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Could not find the item',
        })
      }
      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Items dropped successfully',
      })
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }

  public async getProductsPerState(req: Request, res: Response) {
    const state: string = req.query.state as unknown as string
    try {
      const Products = await this.dashboardService.getProductsPerState(state)
      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Products,
      })
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }
}
