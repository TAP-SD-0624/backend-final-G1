import { Product } from "../../models";


export interface IDashboardRepository {
  getMostBoughtProductsOverTime(startTime: Date, endTime: Date): Promise<Product[]>
  getProductsNotBought(startTime: Date, endTime: Date): Promise<Product[]>
  // don't know what is this.
  getListOfItemsToDrop(): Promise<Product[]>
  getProductsPerCountry(country: string): Promise<Product[]>
}