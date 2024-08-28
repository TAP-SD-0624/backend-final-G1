import { Brand } from '../models'
import { InternalServerError } from '../Errors/InternalServerError'
import { brandRepository } from '../data-access'
import { inject, injectable } from 'tsyringe'
import { ILogger } from '../helpers/Logger/ILogger'

@injectable()
export default class BrandService {
  constructor(@inject('ILogger') private logger: ILogger) {}

  /**
   * @throws {Error} error when it fails to retrieve the brands.
   * @returns {Brand[]} List of brands exist in the database.
   */
  public async ListBrands(): Promise<Brand[]> {
    try {
      return await brandRepository.findAll()
    } catch (error: any) {
      this.logger.error(error)

      throw new InternalServerError()
    }
  }
}
