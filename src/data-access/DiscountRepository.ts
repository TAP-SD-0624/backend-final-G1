import { Discount } from '../models'
import { IDiscountRepository } from './Interfaces/IDiscountRepository'
import { RepositoryBase } from './RepositoryBase'

export class DiscountRepository
  extends RepositoryBase<Discount>
  implements IDiscountRepository
{
  async GetDiscounteadItems(): Promise<Discount[]> {
    return await Discount.findAll({})
  }
}
