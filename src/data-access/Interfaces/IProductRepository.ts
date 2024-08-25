import { GetProductOptions } from '../../Types/GetProductOptions'
import { Product } from '../../models'
import { IRepositoryBase } from './IRepositoryBase'

export interface IProductRepository extends IRepositoryBase<Product> {
  // all find methods
  GetProduct(productId: number): Promise<Product | null>
  GetProducts(
    page: number,
    pageSize: number,
    options: GetProductOptions
  ): Promise<Product[]>
  CreateProduct(product: Product): Promise<Product | null>
}
