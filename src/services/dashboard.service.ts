import { Product } from "../models";
import { injectable } from "tsyringe";
import { dashboardRepository } from "../data-access";

@injectable()
export default class DashboardService {


  public async getMostBoughtProductsOverTime(startTime: Date, endTime: Date): Promise<Product[]> {
  }


  public async getProductsNotBought(): Promise<Product[]> {

  }

  public async getListOfItemsToDrop(): Promise<Product[]> {
  }

  public async getProductsPerCountry(country: string): Promise<Product[]> {
  }
}
