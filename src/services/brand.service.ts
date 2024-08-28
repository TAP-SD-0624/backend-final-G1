import { Brand } from '../models'
import { InternalServerError } from '../Errors/InternalServerError'
import { brandRepository } from '../data-access'
import { injectable } from 'tsyringe'
import logger from '../helpers/logger'

@injectable()
export default class BrandService {
  /**
   * @throws {Error} error when it fails to retrieve the brands.
   * @returns {Brand[]} List of brands exist in the database.
   */
  public async ListBrands(): Promise<Brand[]> {
    try {
      return await brandRepository.findAll()
    } catch (error: any) {
      logger.error({
        name: error.name,
        message: error.message,
        stack: error?.stack,
      })

      throw new InternalServerError()
    }
  }
}
