import { Brand } from '../models'
import { ICartRepository } from './Interfaces'
import { IBrandRepository } from './Interfaces/IBrandRepository'
import { RepositoryBase } from './RepositoryBase'

export class BrandRepository
  extends RepositoryBase<Brand>
  implements IBrandRepository
{
  /**
   *
   * @param {string} name of the brand wanting to be created.
   * @returns {Brand} brand were found with the same name, or created brand.
   * @throws {Error} when it fails to create a Brand.
   */
  async GetOrCreate(name: string): Promise<Brand> {
    const [brand, status] = await this.model.findOrCreate({
      where: { name },
      returning: true,
    })
    return brand
  }
}
