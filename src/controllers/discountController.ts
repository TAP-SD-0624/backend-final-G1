import { DiscountService } from '../services'
import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
import { InternalServerErrorResponse } from '../helpers/DefaultResponses/DefaultResponses'

@injectable()
export class DiscountController {
  constructor(
    @inject(DiscountService) private discountService: DiscountService
  ) {}

  public async AddDiscount(req: Request, res: Response) {
    try {
      const { productId, discountValue } = req.body

      const Discount = await this.discountService.AddDiscount(
        productId,
        discountValue
      )

      return res.status(StatusCodes.CREATED).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Successfully added the discount',
        Discount,
      })
    } catch (ex) {
      return InternalServerErrorResponse(res)
    }
  }
}
