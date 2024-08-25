import { injectable } from 'tsyringe'
import { discountRepository } from '../data-access'
import { Discount } from '../models'
@injectable()
export default class DiscountService {
  GetDiscountedItemsAsync = async () => {
    return await discountRepository.GetDiscounteadItems()
  }

  AddDiscount = async (
    productId: number,
    discountValue: number
  ): Promise<Discount> => {
    return await discountRepository.AddDiscount(productId, discountValue)
  }
}
