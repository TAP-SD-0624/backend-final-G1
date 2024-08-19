import { Router } from 'express'
import { container } from 'tsyringe'
import { CategoryController } from '../controllers/CategoryController'

const categoryRoutes = Router()
const categoryController = container.resolve(CategoryController)

categoryRoutes.get(
  '/',
  categoryController.getAllCategories.bind(categoryController)
)
categoryRoutes.get(
  '/:id',
  categoryController.getCategoryByID.bind(categoryController)
)
categoryRoutes.post(
  '/',
  categoryController.createCategory.bind(categoryController)
)
categoryRoutes.put(
  '/:id',
  categoryController.updateCategory.bind(categoryController)
)
categoryRoutes.delete(
  '/:id',
  categoryController.deleteCategory.bind(categoryController)
)

export default categoryRoutes
