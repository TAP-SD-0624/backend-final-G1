import { categoryRepository } from '../data-access'
import { Category } from '../models'
import { CategoryDTO } from '../Types/DTO'
import { InternalServerError } from '../Errors/InternalServerError'
import { ValidationError as VE } from 'sequelize'
import { ValidationError } from '../Errors/ValidationError'
import { ILogger } from '../helpers/Logger/ILogger'
import { inject, injectable } from 'tsyringe'
@injectable()
export default class CategoryService {
  constructor(@inject('ILogger') private logger: ILogger) {}
  async createCategory(categoryData: CategoryDTO): Promise<Category> {
    try {
      const newCategory = new Category()
      newCategory.name = categoryData.name
      const category = await categoryRepository.create(newCategory)

      if (!category) {
        throw new Error('Failed to create category')
      }
      return category
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new Error('Failed to create category')
    }
  }

  async updateCategory(
    categoryId: number,
    categoryData: CategoryDTO
  ): Promise<Category> {
    try {
      const oldCategory = await categoryRepository.findById(categoryId)
      if (!oldCategory) {
        throw new Error("Category Doesn't exist")
      }

      oldCategory.name = categoryData.name
      const category = await categoryRepository.update(oldCategory)
      if (!category) {
        throw new Error('Failed to update category')
      }
      return category
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new Error('Failed to update category')
    }
  }

  // all find methods
  async findById(id: number): Promise<Category | null> {
    try {
      const category = await categoryRepository.findById(id)
      return category
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new Error("Couldn't find category")
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const categories = await categoryRepository.findAll()
      return categories
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new Error('Failed to get All categories')
    }
  }
  async findByName(name: string): Promise<Category | null> {
    try {
      const category = await categoryRepository.findByName(name)
      return category
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new Error('failed to get category by name')
    }
  }

  async deleteCategory(CategoryId: number): Promise<boolean> {
    try {
      const deletedCategory = await categoryRepository.delete(CategoryId)

      return deletedCategory
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new Error('failed to delete category')
    }
  }
}
