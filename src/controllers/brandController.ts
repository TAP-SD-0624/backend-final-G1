import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { BrandService } from '../services'
import { ResponseCodes } from '../enums/ResponseCodesEnum'

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
      return res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error, please try again later.',
      })
    }
  }
}
