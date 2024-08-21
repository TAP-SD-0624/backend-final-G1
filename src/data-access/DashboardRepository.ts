import { Product } from "../models"
import { IDashboardRepository } from "./Interfaces/IDashboardRepository"


export class DashboardRepository implements IDashboardRepository {
  getMostBoughtProductsOverTime(startTime: Date, endTime: Date): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }
  getProductsNotBought(): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }
  getListOfItemsToDrop(): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }
  getProductsPerCountry(country: string): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }
}