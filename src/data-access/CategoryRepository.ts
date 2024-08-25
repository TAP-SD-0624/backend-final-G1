import { Category, Product } from '../models'
import { ICategoryRepository } from './Interfaces/ICategoryRepository'
import { RepositoryBase } from './RepositoryBase'

export class CategoryRepository
  extends RepositoryBase<Category>
  implements ICategoryRepository
{
  /**
   * retrieve a category with specified name
   * @param {string} name - this is the name of category we want to retrieve from our Database.
   * @returns {Category | null} returns the category identified with the name, if not found returns null.
   * @throws {Error} when it fails to retrieve from or connect with the database.
   */
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
