import { inject, injectable } from 'tsyringe'
import { dashboardRepository } from '../data-access'
import { InternalServerError } from '../Errors/InternalServerError'
import { GetProductDashboardDTO } from '../Types/DTO'
import { ILogger } from '../helpers/Logger/ILogger'

@injectable()
export default class DashboardService {
  constructor(@inject('ILogger') private logger: ILogger) {}

  public async getMostBoughtProductsOverTime(
    startTime: Date,
    endTime: Date
  ): Promise<GetProductDashboardDTO[]> {
    try {
      return await dashboardRepository.getMostBoughtProductsOverTime(
        startTime,
        endTime
      )
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }

  public async getProductsNotBought(
    startTime: Date,
    endTime: Date
  ): Promise<GetProductDashboardDTO[]> {
    try {
      return await dashboardRepository.getProductsNotBought(startTime, endTime)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }

  public async DropItemsFromList(ids: number[]): Promise<Boolean> {
    try {
      return await dashboardRepository.DropItemsFromList(ids)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }

  public async getProductsPerState(
    state: string
  ): Promise<GetProductDashboardDTO[]> {
    try {
      return await dashboardRepository.getProductsPerState(state)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }
}
