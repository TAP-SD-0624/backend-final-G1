import { Category } from '../../models'
import { IRepositoryBase } from './IRepositoryBase'

export interface ICategoryRepository extends IRepositoryBase<Category> {
  findByName(name: string): Promise<Category | null>
}
