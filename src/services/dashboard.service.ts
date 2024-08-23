import { Product } from "../models";
import { injectable } from "tsyringe";
import { dashboardRepository } from "../data-access";
import { InternalServerError } from "../Errors/InternalServerError";
import logger from "../helpers/logger";
import { GetProductDashboardDTO } from "../Types/DTO";

@injectable()
export default class DashboardService {


  public async getMostBoughtProductsOverTime(startTime: Date, endTime: Date): Promise<GetProductDashboardDTO[]> {
    try {
      return await dashboardRepository.getMostBoughtProductsOverTime(startTime, endTime);
    }
    catch (error) {
      logger.error(error);
      throw new InternalServerError("An error occurred, please try again later.");
    }
  }


  public async getProductsNotBought(startTime: Date, endTime: Date): Promise<GetProductDashboardDTO[]> {
    try {
      return await dashboardRepository.getProductsNotBought(startTime, endTime);
    }
    catch (error) {
      logger.error(error);

      throw new InternalServerError("An error occurred, please try again later.");
    }

  }

  public async DropItemsFromList(ids: number[]): Promise<Boolean> {
    try {
      return await dashboardRepository.DropItemsFromList(ids);
    }
    catch (error) {
      logger.error(error);

      throw new InternalServerError("An error occurred, please try again later.");
    }
  }

  public async getProductsPerState(state: string): Promise<GetProductDashboardDTO[]> {
    try {
      return await dashboardRepository.getProductsPerState(state);
    }
    catch (error) {
      logger.error(error);
      throw new InternalServerError("An error occurred, please try again later.");
    }
  }
}
