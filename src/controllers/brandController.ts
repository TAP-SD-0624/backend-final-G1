import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { BrandService } from '../services'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
import { InternalServerErrorResponse } from '../helpers/DefaultResponses/DefaultResponses'

@injectable()
export class BrandController {
  constructor(@inject(BrandService) private brandService: BrandService) {}

  async ListBrands(req: Request, res: Response) {
    try {
      const brands = await this.brandService.ListBrands()
      return res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        brands,
      })
    } catch (ex) {
      return InternalServerErrorResponse(res)
    }
  }
}
