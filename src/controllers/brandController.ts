import { Request, Response } from 'express'
import AuthService from '../services/auth.service'
import { inject, injectable } from 'tsyringe'
import { UserDTO } from '../Types/DTO'
import { BrandService } from '../services'

@injectable()
export class BrandController {
  constructor(@inject(BrandService) private brandService: BrandService) {}

  async ListBrands(req: Request, res: Response) {
    try {
      const brands = await this.brandService.ListBrands()
      return res.status(200).json({ brands })
    } catch (ex) {
      return res.status(500).json({ error: 'internal server error' })
    }
  }
}
