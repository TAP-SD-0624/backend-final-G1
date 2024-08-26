import { categoryRepository } from '../data-access'
import { Category } from '../models'
import { CategoryDTO } from '../Types/DTO'
import { InternalServerError } from '../Errors/InternalServerError'
import logger from '../helpers/logger'
import { ValidationError as VE } from 'sequelize'
import { ValidationError } from '../Errors/ValidationError'

export default class CategoryService {
  async createCategory(categoryData: CategoryDTO): Promise<Category> {
    try {
      const newCategory = new Category()
      newCategory.name = categoryData.name
      const category = await categoryRepository.create(newCategory)

      if (!category) {
        throw new Error('Failed to create category  `')
      }
      return category
    } catch (error: any) {
      if (error instanceof VE) {
        throw new ValidationError(error.message)
      }
      logger.error({
        name: error.name,
        message: error.message,
        stack: error?.stack,
      })
      throw new InternalServerError('Failed to create category')
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
    } catch (error: any) {
      logger.error({
        name: error.name,
        message: error.message,
        stack: error?.stack,
      })
      throw new InternalServerError('updating category failed')
    }
  }

  // all find methods
  async findById(id: number): Promise<Category | null> {
    try {
      const category = await categoryRepository.findById(id)
      return category
    } catch (error: any) {
      logger.error({
        name: error.name,
        message: error.message,
        stack: error?.stack,
      })
      throw new InternalServerError("Couldn't find category")
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const categories = await categoryRepository.findAll()
      return categories
    } catch (error: any) {
      logger.error({
        name: error.name,
        message: error.message,
        stack: error?.stack,
      })
      throw new InternalServerError('Failed to get All categories')
    }
  }
  async findByName(name: string): Promise<Category | null> {
    try {
      const category = await categoryRepository.findByName(name)
      return category
    } catch (error: any) {
      logger.error({
        name: error.name,
        message: error.message,
        stack: error?.stack,
      })
      throw new InternalServerError('failed to get category by name')
    }
  }

  async deleteCategory(CategoryId: number): Promise<boolean> {
    try {
      const deletedCategory = await categoryRepository.delete(CategoryId)

      return deletedCategory
    } catch (error: any) {
      logger.error({
        name: error.name,
        message: error.message,
        stack: error?.stack,
      })
      throw new InternalServerError('failed to delete category')
    }

    return false
  }
}
