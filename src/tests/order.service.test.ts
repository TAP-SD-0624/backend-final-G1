import 'reflect-metadata'
import OrderService from '../services/order.service'
import { orderRepository } from '../data-access'
import { OrderDTO } from '../Types/DTO'
import { InternalServerError } from '../Errors/InternalServerError'
import { BadRequestError } from '../Errors/BadRequestError'
import { OrderStatus } from '../enums/OrderStatusEnum'
import logger from '../helpers/logger'

jest.mock('../data-access/orderRepository')
jest.mock('../helpers/logger')
jest.mock('../models/Order.model.ts', () => {
  return {
    Order: jest.fn().mockImplementation(() => {
      return {
        status: "processed",
        isPaid: false,
        userId: 1,
        addressId: 1,
        toJSON() {
          return {
            status: "processed",
            isPaid: false,
            userId: 1,
            addressId: 1,
          }
        }
      };
    }),
  };
});
describe('OrderService', () => {
  let orderService: OrderService

  beforeEach(() => {
    orderService = new OrderService()
    jest.clearAllMocks()
  })

  describe('createOrder', () => {
    it('should create a new order and return the order DTO P0', async () => {
      const userId = 1
      const isPaid = true
      const products = [
        { dataValues: { id: 1 } },
        { dataValues: { id: 2 } },
      ] as any
      const order = {
        toJSON() {
          return { id: 1, isPaid, status: 'processed', userId, products }
        },
      } as any
      const orderDTO: OrderDTO = {
        id: 1,
        isPaid,
        status: OrderStatus.processed,
        products,
      }

        ; (orderRepository.createOrder as jest.Mock).mockResolvedValue(order)

      const result = await orderService.createOrder(userId, isPaid, products)

      expect(orderRepository.createOrder).toHaveBeenCalledWith(
        expect.any(Object),
        [1, 2]
      )
      expect(result).toEqual(orderDTO)
    })

    it('should throw an InternalServerError if an error occurs P0', async () => {
      const userId = 1
      const isPaid = true
      const products = [
        { dataValues: { id: 1 } },
        { dataValues: { id: 2 } },
      ] as any
      const err = new Error('Database error')
        ; (orderRepository.createOrder as jest.Mock).mockRejectedValue(err)

      await expect(
        orderService.createOrder(userId, isPaid, products)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalledWith({
        name: err.name,
        message: err.message,
        stack: err?.stack,
      })
    })
  })

  describe('getOrderById', () => {
    it('should return the order DTO for a given order ID and user ID P0', async () => {
      const id = 1
      const userId = 1
      const order = {
        toJSON() {
          return {
            id,
            userId,
            status: OrderStatus.processed,
            isPaid: true,
            products: [],
          }
        },
      } as any
      const orderDTO: OrderDTO = {
        id,
        status: OrderStatus.processed,
        isPaid: true,
        products: [],
      }

        ; (orderRepository.findByIdAndUserId as jest.Mock).mockResolvedValue(order)

      const result = await orderService.getOrderById(id, userId)

      expect(orderRepository.findByIdAndUserId).toHaveBeenCalledWith(id, userId)
      expect(result).toEqual(orderDTO)
    })

    it('should return null if no order is found P1', async () => {
      const id = 1
      const userId = 1

        ; (orderRepository.findByIdAndUserId as jest.Mock).mockResolvedValue(null)

      const result = await orderService.getOrderById(id, userId)

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const id = 1
      const userId = 1
      const err = new Error('Database error')
        ; (orderRepository.findByIdAndUserId as jest.Mock).mockRejectedValue(err)

      await expect(orderService.getOrderById(id, userId)).rejects.toThrow(
        InternalServerError
      )
      expect(logger.error).toHaveBeenCalledWith({
        name: err.name,
        message: err.message,
        stack: err?.stack,
      })
    })
  })

  describe('getOrders', () => {
    it('should return all orders for a given user ID P0', async () => {
      const userId = 1
      const orders = [
        {
          toJSON() {
            return {
              id: 1,
              userId,
              status: OrderStatus.processed,
              isPaid: true,
              products: [],
            }
          },
        },
      ] as any
      const ordersDTO: OrderDTO[] = [
        { id: 1, status: OrderStatus.processed, isPaid: true, products: [] },
      ]

        ; (orderRepository.findByUserId as jest.Mock).mockResolvedValue(orders)

      const result = await orderService.getOrders(userId)

      expect(orderRepository.findByUserId).toHaveBeenCalledWith(userId)
      expect(result).toEqual(ordersDTO)
    })

    it('should return null if no orders are found P1', async () => {
      const userId = 1

        ; (orderRepository.findByUserId as jest.Mock).mockResolvedValue(null)

      const result = await orderService.getOrders(userId)

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const userId = 1

      const err = new Error('Database error')

        ; (orderRepository.findByUserId as jest.Mock).mockRejectedValue(err)

      await expect(orderService.getOrders(userId)).rejects.toThrow(
        InternalServerError
      )
      expect(logger.error).toHaveBeenCalledWith({
        name: err.name,
        message: err.message,
        stack: err?.stack,
      })
    })
  })

  describe('updateOrder', () => {
    it('should update the order status and return the updated order DTO P0', async () => {
      const id = 1
      const userId = 1
      const status = OrderStatus.outForDelivery
      const order = {
        toJSON() {
          return { id, userId, status, isPaid: true, products: [] }
        },
      } as any
      const orderDTO: OrderDTO = { id, status, isPaid: true, products: [] }

        ; (orderRepository.findByIdAndUserId as jest.Mock).mockResolvedValue(order)
        ; (orderRepository.update as jest.Mock).mockResolvedValue(order)

      const result = await orderService.updateOrder(id, userId, status, true)

      expect(orderRepository.findByIdAndUserId).toHaveBeenCalledWith(id, userId)
      expect(orderRepository.update).toHaveBeenCalledWith(expect.any(Object))
      expect(result).toEqual(orderDTO)
    })

    it('should throw a BadRequestError if the order status cannot be changed P1', async () => {
      const id = 1
      const userId = 1
      const status = OrderStatus.delivered
      const oldOrder = {
        toJSON() {
          return {
            id,
            userId,
            status: OrderStatus.processed,
            isPaid: true,
            products: [],
          }
        },
      } as any

        ; (orderRepository.findByIdAndUserId as jest.Mock).mockResolvedValue(
          oldOrder
        )

      await expect(
        orderService.updateOrder(id, userId, status, true)
      ).rejects.toThrow(BadRequestError)
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const id = 1
      const userId = 1
      const status = OrderStatus.outForDelivery
      const err = new Error('Database error')
        ; (orderRepository.findByIdAndUserId as jest.Mock).mockRejectedValue(err)

      await expect(
        orderService.updateOrder(id, userId, status, true)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalledWith({
        name: err.name,
        message: err.message,
        stack: err?.stack,
      })
    })
  })

  describe('cancelOrder', () => {
    it('should cancel the order and return true if the order is processed P0', async () => {
      const id = 1
      const userId = 1
      const order = {
        id,
        userId,
        status: OrderStatus.processed,
        toJSON() {
          return this
        },
      } as any

        ; (orderRepository.findByIdAndUserId as jest.Mock).mockResolvedValue(order)
        ; (orderRepository.delete as jest.Mock).mockResolvedValue(true)

      const result = await orderService.cancelOrder(id, userId)

      expect(orderRepository.findByIdAndUserId).toHaveBeenCalledWith(id, userId)
      expect(orderRepository.delete).toHaveBeenCalledWith(id)
      expect(result).toBe(true)
    })

    it('should return false if the order is not processed P1', async () => {
      const id = 1
      const userId = 1
      const order = {
        id,
        userId,
        status: OrderStatus.delivered,
        toJSON() {
          return this
        },
      } as any

        ; (orderRepository.findByIdAndUserId as jest.Mock).mockResolvedValue(order)

      const result = await orderService.cancelOrder(id, userId)

      expect(result).toBe(false)
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const id = 1
      const userId = 1
      const err = new Error('Database error')

        ; (orderRepository.findByIdAndUserId as jest.Mock).mockRejectedValue(err)

      await expect(orderService.cancelOrder(id, userId)).rejects.toThrow(
        InternalServerError
      )
      expect(logger.error).toHaveBeenCalledWith({
        name: err.name,
        message: err.message,
        stack: err?.stack,
      })
    })
  })
})
