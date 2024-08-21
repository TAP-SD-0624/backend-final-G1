import { ProductDTO } from '../Types/DTO'
import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'
import { DashboardService } from '../services'


@injectable()
export class DashboardController {
  constructor(@inject(DashboardService) private dashboardService: DashboardService) { }

  public async getMostBoughtProductsOverTime(req: Request, res: Response): Promise<ProductDTO[]> {
  }

  public async getProductsNotBought(req: Request, res: Response): Promise<ProductDTO[]> {

  }

  public async getListOfItemsToDrop(req: Request, res: Response): Promise<ProductDTO[]> {
  }

  public async getProductsPerCountry(req: Request, res: Response): Promise<ProductDTO[]> {
  }

}