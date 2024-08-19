import { categoryRepository } from '../data-access'
import { Category } from '../models'
import { CategoryDTO } from '../Types/DTO'

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
    } catch (error) {
      throw new Error('Error creating category')
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
    } catch (error) {
      throw new Error(`Error while updating category`)
    }
  }

  // all find methods
  async findById(id: number): Promise<Category | null> {
    try {
      const category = await categoryRepository.findById(id)
      return category
    } catch (error) {
      throw new Error('Error retrieving category')
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const categories = await categoryRepository.findAll()
      return categories
    } catch (error) {
      throw new Error('Error retrieving Categories')
    }
  }
  async findByName(name: string): Promise<Category | null> {
    try {
      const category = await categoryRepository.findByName(name)
      return category
    } catch (error) {
      throw new Error('Error retrieving Category')
    }
  }

  async deleteCategory(CategoryId: number): Promise<boolean> {
    try {
      const deletedCategory = await categoryRepository.delete(CategoryId)

      return deletedCategory
    } catch (error) {
      throw new Error(`Error while deleting category`)
    }

    return false
  }
}
