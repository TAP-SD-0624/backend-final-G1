import { Category, Discount } from '../../models'
import { IRepositoryBase } from './IRepositoryBase'

export interface IDiscountRepository extends IRepositoryBase<Discount> {
  GetDiscounteadItems(): Promise<Discount[]>
}
