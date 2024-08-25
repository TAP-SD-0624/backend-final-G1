import { CommentService, DiscountService } from '../services'
import { CommentDTO } from '../Types/DTO'
import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'

@injectable()
export class DiscountController {
  constructor(
    @inject(DiscountService) private discountService: DiscountService
  ) {}

  public async AddDiscount(req: Request, res: Response) {
    try {
      const { productId, discountValue } = req.body

      const result = await this.discountService.AddDiscount(
        productId,
        discountValue
      )

      return res.status(201).json({ discount: result })
    } catch (ex) {
      console.log(ex)
      return res.status(500).json({ error: 'internal server error' })
    }
  }
}
