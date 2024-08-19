import { Router } from 'express'
import { ProductController } from '../controllers/ProductController'
import { container } from 'tsyringe'
import { uploadMiddleware } from '../middleware/UploadMiddleware'
/* const productRepository = new ProductRepository();
const productService = new ProductService();
const productController = new ProductController(); */
const productController = container.resolve(ProductController)

const router = Router()
router.get('/list', productController.GetProducts.bind(productController))
router.get('/:id', productController.getProductById.bind(productController))

router.post(
  '/create',
  uploadMiddleware.array('photos'),
  productController.createProduct.bind(productController)
)

router.patch('/:id', productController.updateProduct.bind(productController))
router.delete('/:id', productController.deleteProduct.bind(productController))

export default router
