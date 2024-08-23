
import { Router } from 'express'
import { container } from 'tsyringe'
import { AddressController } from '../controllers'
import authAndRoleMiddleware from '../middleware/authMiddleware'
import { createAddressValidator, getAndDeleteAddressValidator, updateAddressValidator } from '../validations'

const addressRouter = Router()
const addressController = container.resolve(AddressController)

addressRouter.use(authAndRoleMiddleware(['user']));
addressRouter.get('/', addressController.getAll.bind(addressController))
addressRouter.post('/', createAddressValidator, addressController.create.bind(addressController))
addressRouter.get('/:id', addressController.get.bind(addressController))
addressRouter.patch('/:id', updateAddressValidator, addressController.update.bind(addressController))
addressRouter.delete('/:id', getAndDeleteAddressValidator, addressController.delete.bind(addressController))

export default addressRouter
