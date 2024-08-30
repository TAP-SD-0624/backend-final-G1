import { Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'
import OrderService from '../services/order.service'
import { OrderStatus } from '../enums/OrderStatusEnum'
import { BadRequestError } from '../Errors/BadRequestError'
import { OrderDTO } from '../Types/DTO'
import { AuthenticatedRequest } from '../helpers/AuthenticatedRequest'
import { EmptyCartError } from '../Errors'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
import { InsufficientStockError } from '../Errors/InsufficientStockError'

@injectable()
export class OrderController {
  constructor(@inject(OrderService) private orderService: OrderService) {}

  async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { isPaid, addressId } = req.body
      const userId = req.user?.id

      const order: OrderDTO = await this.orderService.createOrder(
        userId,
        isPaid,
        addressId
      )

      // Ensure order is created successfully
      if (!order) {
        return res.status(500).json({
          ResponseCode: ResponseCodes.InternalServerError,
          Message: 'Order creation failed',
        })
      }

      res.status(201).json(order)
    } catch (error: any) {
      if (error instanceof EmptyCartError) {
        return res.status(400).json({
          ResponseCode: ResponseCodes.EmptyCart,
          Message: error.message,
        })
      }
      if (error instanceof BadRequestError) {
        return res.status(400).json({
          ResponseCode: ResponseCodes.BadRequest,
          Message: error.message,
        })
      }
      if (error instanceof InsufficientStockError) {
        return res.status(400).json({
          ResponseCode: ResponseCodes.BadRequest,
          Message: error.message,
        })
      }
      return res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error, please try again later',
      })
    }
  }

  async getOrderByUserId(req: Request, res: Response) {
    try {
      const id = req.params.id as unknown as number
      const userId = (req as any).user.id
      const order = await this.orderService.getOrderById(id, userId)
      if (!order) {
        res.status(404).json({ error: 'Order not found' })
        return null
      }
      res.json(order)
      return order
    } catch (error: any) {
      res.status(500).json({ error: error.message })
      throw error
    }
  }

  async getOrdersByUserId(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id
      const orders = await this.orderService.getOrders(userId)
      if (!orders) {
        res.status(404).json({ error: 'No Orders found' })
        return null
      }
      res.json(orders)
      return orders
    } catch (error: any) {
      res.status(500).json({ error: error.message })
      throw error
    }
  }
  async updateOrder(req: Request, res: Response) {
    try {
      const id = req.params.id as unknown as number
      const userId = (req as any).user.id
      const newStatus: OrderStatus = req.body.status
      const isPaid = req.body.isPaid

      if (isPaid && Math.random() < 0.5) {
        return res
          .status(400)
          .json({ error: 'Payment failed, Not Enough Credit.' })
      }
      const order = await this.orderService.updateOrder(
        id,
        userId,
        newStatus,
        isPaid
      )
      if (!order) {
        res.status(404).json({ error: 'Order not found' })
        return null
      }

      res.json(order)
      return order
    } catch (error: any) {
      if (error instanceof BadRequestError)
        res.status(400).json({ error: error.message })
      else res.status(500).json({ error: error.message })
      throw error
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      const id = req.params.id as unknown as number
      const userId = (req as any).user.id
      const canceled = await this.orderService.cancelOrder(id, userId)
      if (!canceled) {
        res.status(400).json({
          error:
            'Order can only be canceled if it is created by the user and status is processed',
        })
      }
      res.status(204).send(canceled)
      return canceled
    } catch (error: any) {
      res.status(500).json({ error: error.message })
      throw error
    }
  }
}
