import { Brand } from '../models'
import { InternalServerError } from '../Errors/InternalServerError'
import { brandRepository } from '../data-access'
import { injectable } from 'tsyringe'
import logger from '../helpers/logger'

@injectable()
export default class BrandService {
  public async ListBrands(): Promise<Brand[]> {
    try {
      const brands = await brandRepository.findAll()
      return brands
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
