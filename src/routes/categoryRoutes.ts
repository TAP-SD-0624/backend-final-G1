import { Router } from 'express'
import { container } from 'tsyringe'
import { CategoryController } from '../controllers/CategoryController'
import {
  getCategoryByIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from '../validations/categoryValidator'

const categoryRoutes = Router()
const categoryController = container.resolve(CategoryController)

categoryRoutes.get(
  '/',
  categoryController.getAllCategories.bind(categoryController)
)
categoryRoutes.get(
  '/:id',
  getCategoryByIdValidator,
  categoryController.getCategoryByID.bind(categoryController)
)
categoryRoutes.post(
  '/',
  createCategoryValidator,
  categoryController.createCategory.bind(categoryController)
)
categoryRoutes.put(
  '/:id',
  updateCategoryValidator,
  categoryController.updateCategory.bind(categoryController)
)
categoryRoutes.delete(
  '/:id',
  deleteCategoryValidator,
  categoryController.deleteCategory.bind(categoryController)
)

export default categoryRoutes
