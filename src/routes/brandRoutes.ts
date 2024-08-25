import { Router } from 'express'
import { container } from 'tsyringe'
import { BrandController } from '../controllers'

const brandRouter = Router()
const authController = container.resolve(BrandController)

brandRouter.get('/list', authController.ListBrands.bind(authController))

export default brandRouter
