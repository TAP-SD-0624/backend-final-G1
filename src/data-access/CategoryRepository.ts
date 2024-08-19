import { Category, Product } from '../models'
import { ICategoryRepository } from './Interfaces/ICategoryRepository'
import { RepositoryBase } from './RepositoryBase'

export class CategoryRepository
  extends RepositoryBase<Category>
  implements ICategoryRepository
{
  async findByName(name: string): Promise<Category | null> {
    try {
      const category = await this.model.findOne({
        where: { name },
      })
      return category
    } catch (error) {
      throw new Error('Error retrieving Category')
    }
  }

  async CreateCategoryList(categories: Category[]) {
    let cats = await Promise.all(
      categories.map(async (title: Category) => {
        const [category] = await Category.findOrCreate({
          where: { name: title.name },
          returning: true,
        })
        return category
      })
    )

    return cats
  }
}
