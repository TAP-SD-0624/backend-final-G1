import { Order, Product } from '../models'
import { OrderDTO } from '../Types/DTO'
import { injectable } from 'tsyringe'
import { orderRepository } from '../data-access'
import { OrderStatus } from '../enums/OrderStatusEnum'
import {
  ordersToOrdersDTO,
  orderToOrderDTO,
} from '../helpers/orders/orderToOrderDTO'
import { InternalServerError } from '../Errors/InternalServerError'
import logger from '../helpers/logger'
import { BadRequestError } from '../Errors/BadRequestError'
import { ValidationError as VE } from 'sequelize'
import { ValidationError } from '../Errors/ValidationError'

@injectable()
export default class OrderService {
  public async createOrder(
    userId: number,
    isPaid: boolean,
    product: Product[]
  ): Promise<OrderDTO> {
    const newOrder = new Order()
    newOrder.isPaid = isPaid
    newOrder.status = OrderStatus.processed
    newOrder.userId = userId
    const productIds: number[] = product.map((product) => product.dataValues.id)
    try {
      const order = await orderRepository.createOrder(newOrder, productIds)
      return orderToOrderDTO(order)
    } catch (error: any) {
      if (error instanceof VE) {
        throw new ValidationError(error.message)
      }
      logger.error({
        name: error.name,
        message: error.message,
        stack: error?.stack,
      })
      throw new InternalServerError()
    }
  }

  public async getOrderById(
    id: number,
    userId: number
  ): Promise<OrderDTO | null> {
    try {
      const order = await orderRepository.findByIdAndUserId(id, userId)
      if (!order) {
        return null
      }
      return orderToOrderDTO(order)
    } catch (error: any) {
      logger.error({
        name: error.name,
        message: error.message,
        stack: error?.stack,
      })
      throw new InternalServerError()
    }
  }

  public async getOrders(userId: number): Promise<OrderDTO[] | null> {
    try {
      const orders = await orderRepository.findByUserId(userId)
      if (!orders) {
        return null
      }
      return ordersToOrdersDTO(orders)
    } catch (error: any) {
      logger.error({
        name: error.name,
        message: error.message,
        stack: error?.stack,
      })
      throw new InternalServerError()
    }
  }

  public async updateOrder(
    id: number,
    userId: number,
    status: OrderStatus,
    isPaid: boolean = false
  ): Promise<OrderDTO | null> {
    try {
      const oldOrder = await orderRepository.findByIdAndUserId(id, userId)
      if (!oldOrder) {
        return null
      }
      const oldOrderJSON = await oldOrder.toJSON()
      isPaid = isPaid || oldOrderJSON.isPaid
      if (oldOrderJSON.status === OrderStatus.processed) {
        if (status !== OrderStatus.outForDelivery) {
          throw new BadRequestError(
            "You can't change the status of a processed order to anything other than outForDelivery."
          )
        }
      }
      if (oldOrderJSON.status === OrderStatus.outForDelivery) {
        if (status !== OrderStatus.delivered && !isPaid) {
          throw new BadRequestError(
            'You can only change the status of an outForDelivery order to delivered if it is paid.'
          )
        }
      }

      if (oldOrderJSON.status === OrderStatus.delivered) {
        throw new BadRequestError(
          "You can't change the status of a delivered order."
        )
      }
      const updateOrder = new Order()
      updateOrder.status = status
      updateOrder.id = id
      updateOrder.isPaid = isPaid
      const order = await orderRepository.update(updateOrder)
      return orderToOrderDTO(order!)
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        throw error
      }
      if (error instanceof VE) {
        throw new ValidationError(error.message)
      }
      logger.error({
        name: error.name,
        message: error.message,
        stack: error?.stack,
      })
      throw new InternalServerError()
    }
  }

  public async cancelOrder(id: number, userId: number): Promise<boolean> {
    try {
      const oldOrder = await orderRepository.findByIdAndUserId(id, userId)
      if (!oldOrder) {
        return false
      }
      const oldOrderJSON = oldOrder?.toJSON()
      if (oldOrderJSON?.status !== OrderStatus.processed) {
        return false
      }
      return await orderRepository.delete(id)
    } catch (error: any) {
      logger.error({
        name: error.name,
        message: error.message,
        stack: error?.stack,
      })
      throw new InternalServerError()
    }
  }
}
