import { Router } from 'express'
import { ProductController } from '../controllers'
import { container } from 'tsyringe'
import { uploadMiddleware } from '../middleware/UploadMiddleware'
import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteValidator,
  GetProductsValidator,
} from '../validations/productValidator'
/* const productRepository = new ProductRepository();
const productService = new ProductService();
const productController = new ProductController(); */
const productController = container.resolve(ProductController)

const router = Router()
router.get(
  '/list',
  GetProductsValidator,
  productController.GetProducts.bind(productController)
)
router.get(
  '/:id',
  getProductValidator,
  productController.getProductById.bind(productController)
)

router.post(
  '/create',
  uploadMiddleware.array('photos'),
  createProductValidator,
  productController.createProduct.bind(productController)
)

router.patch(
  '/:id',
  updateProductValidator,
  productController.updateProduct.bind(productController)
)
router.delete(
  '/:id',
  deleteValidator,
  productController.deleteProduct.bind(productController)
)

router.get('/search', productController.SearchProduct.bind(productController))

export default router
