import { Product } from "../../models";


export interface IDashboardRepository {
  getMostBoughtProductsOverTime(startTime: Date, endTime: Date): Promise<Product[]>
  getProductsNotBought(startTime: Date, endTime: Date): Promise<Product[]>
  // don't know what is this.
  DropItemsFromList(ids: number[]): Promise<Boolean>
  getProductsPerState(state: string): Promise<Product[]>
}