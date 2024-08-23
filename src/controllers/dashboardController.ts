import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'
import { DashboardService } from '../services'

@injectable()
export class DashboardController {
  constructor(
    @inject(DashboardService) private dashboardService: DashboardService
  ) {}

  public async getMostBoughtProductsOverTime(req: Request, res: Response) {
    const startTime = req.query.startTime as unknown as Date
    const endTime = req.query.endTime as unknown as Date
    try {
      const products =
        await this.dashboardService.getMostBoughtProductsOverTime(
          startTime,
          endTime
        )
      if (products.length === 0) {
        return res.status(404).json({ error: 'No Products found' })
      }
      return res.status(200).json(products)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  public async getProductsNotBought(req: Request, res: Response) {
    const startTime = req.query.startTime as unknown as Date
    const endTime = req.query.endTime as unknown as Date
    try {
      const products = await this.dashboardService.getProductsNotBought(
        startTime,
        endTime
      )
      if (products.length === 0) {
        return res.status(404).json({ error: 'No Products found' })
      }
      return res.status(200).json(products)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  public async DropItemsFromList(req: Request, res: Response) {
    const ids = req.body.ids as unknown as number[]
    try {
      const count = await this.dashboardService.DropItemsFromList(ids)
      if (!count) {
        return res.status(404).json({ error: 'Failed to Drop the Items' })
      }
      return res.status(200).json({ message: 'Items dropped successfully' })
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  public async getProductsPerState(req: Request, res: Response) {
    const state: string = req.query.state as unknown as string
    try {
      const products = await this.dashboardService.getProductsPerState(state)
      if (products.length === 0) {
        return res.status(404).json({ error: 'No Products found' })
      }
      return res.status(200).json(products)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }
}
