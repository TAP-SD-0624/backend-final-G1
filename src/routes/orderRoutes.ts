import { Router } from 'express'
import { container } from 'tsyringe'
import { OrderController } from '../controllers/orderController'
import authAndRoleMiddleware from '../middleware/authMiddleware'
import { createOrderValidator, updateOrderValidator } from '../validations'

const orderRouter = Router()
const orderController = container.resolve(OrderController)

orderRouter.post(
  '/',
  authAndRoleMiddleware(['user']),
  createOrderValidator,
  orderController.createOrder.bind(orderController)
)
orderRouter.get(
  '/',
  authAndRoleMiddleware(['user']),
  orderController.getOrdersByUserId.bind(orderController)
)
orderRouter.get(
  '/:id',
  authAndRoleMiddleware(['user']),
  orderController.getOrderByUserId.bind(orderController)
)
orderRouter.patch(
  '/:id',
  authAndRoleMiddleware(['user']),
  updateOrderValidator,
  orderController.updateOrder.bind(orderController)
)
orderRouter.delete(
  '/:id',
  authAndRoleMiddleware(['user']),
  orderController.deleteOrder.bind(orderController)
)

export default orderRouter
