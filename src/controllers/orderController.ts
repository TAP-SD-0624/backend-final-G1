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
import { StatusCodes } from 'http-status-codes'
import { InternalServerErrorResponse } from '../helpers/DefaultResponses/DefaultResponses'

@injectable()
export class OrderController {
  constructor(@inject(OrderService) private orderService: OrderService) {}

  async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { isPaid, addressId } = req.body

      const userId = req.user?.id

      const Order: OrderDTO = await this.orderService.createOrder(
        userId,
        isPaid,
        addressId
      )
      return res.status(StatusCodes.CREATED).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Created Successfully',
        Order,
      })
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
      return InternalServerErrorResponse(res)
    }
  }

  async getOrderByUserId(req: Request, res: Response) {
    try {
      const id = req.params.id as unknown as number
      const userId = (req as any).user.id
      const Order = await this.orderService.getOrderById(id, userId)
      if (!Order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Order not found',
        })
      }
      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Sucess',
        Order,
      })
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }

  async getOrdersByUserId(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id
      const orders = await this.orderService.getOrders(userId)
      if (!orders) {
        return res.status(404).json({ error: 'No Orders found' })
      }
      return res.json(orders)
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }
  async updateOrder(req: Request, res: Response) {
    try {
      const id = req.params.id as unknown as number
      const userId = (req as any).user.id
      const newStatus: OrderStatus = req.body.status
      const isPaid = req.body.isPaid

      if (isPaid && Math.random() < 0.5) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          ResponseCode: ResponseCodes.BadRequest,
          Message: 'Payment failed, Not Enough Credit.',
        })
      }
      const Order = await this.orderService.updateOrder(
        id,
        userId,
        newStatus,
        isPaid
      )
      if (!Order) {
        return res.status(StatusCodes.NOT_FOUND).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Order not found',
        })
      }

      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Order,
      })
    } catch (error: any) {
      if (error instanceof BadRequestError)
        return res.status(400).json({ error: error.message })
      else {
        return InternalServerErrorResponse(res)
      }
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      const id = req.params.id as unknown as number
      const userId = (req as any).user.id
      const canceled = await this.orderService.cancelOrder(id, userId)
      if (!canceled) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          ResponseCode: ResponseCodes.BadRequest,
          Message:
            'Order can only be canceled if it is created by the user and status is processed',
        })
      }
      return res.status(StatusCodes.NO_CONTENT).send()
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }
}
