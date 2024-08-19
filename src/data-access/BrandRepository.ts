import { Brand } from '../models'
import { ICartRepository } from './Interfaces'
import { IBrandRepository } from './Interfaces/IBrandRepository'
import { RepositoryBase } from './RepositoryBase'

export class BrandRepository
  extends RepositoryBase<Brand>
  implements IBrandRepository
{
  async GetOrCreate(name: string): Promise<Brand> {
    const [brand, status] = await this.model.findOrCreate({
      where: { name },
      returning: true,
    })
    return brand
  }
}
