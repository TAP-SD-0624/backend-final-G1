import { DiscountRepository } from '../data-access/DiscountRepository'
import { injectable } from 'tsyringe'

@injectable()
export default class DiscountService {
  repository: DiscountRepository
  constructor(repository: DiscountRepository) {
    this.repository = repository
  }
  GetDiscountedItemsAsync = async () => {
    return await this.repository.GetDiscounteadItems()
  }
}
