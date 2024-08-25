import { Discount, Product } from '../models'
import { IDiscountRepository } from './Interfaces/IDiscountRepository'
import { RepositoryBase } from './RepositoryBase'

export class DiscountRepository
  extends RepositoryBase<Discount>
  implements IDiscountRepository
{
  async GetDiscounteadItems(): Promise<Discount[]> {
    return await this.model.findAll({ include: [{ model: Product }] })
  }

  async AddDiscount(productId: number, discountValue: number) {
    const data: Discount = {
      productId,
      discountRate: discountValue,
    } as Discount

    const [record] = await this.model.upsert(data, {
      returning: true,
    })
    return record
  }
}
