import { Response } from 'express'
import { injectable, inject } from 'tsyringe'
import CartService from '../services/cart.service'
import { AuthenticatedRequest } from '../helpers/AuthenticatedRequest'
import { NotFoundError } from '../Errors/NotFoundError'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
import { InsufficientStockError } from '../Errors/InsufficientStockError'
import { InternalServerErrorResponse } from '../helpers/DefaultResponses/DefaultResponses'
import { StatusCodes } from 'http-status-codes'

@injectable()
export class CartController {
  constructor(@inject(CartService) private cartService: CartService) {}

  async GetCartByUserId(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id
      const cart = await this.cartService.GetCartByUserId(userId)
      return res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Cart Retrieved successfully',
        cart,
      })
    } catch (error: any) {
      return res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error, please try again later.',
      })
    }
  }

  async ClearCart(req: AuthenticatedRequest, res: Response) {
    try {
      await this.cartService.ClearCart(req.user?.id)
      res.status(StatusCodes.OK).send()
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }

  // add product to cart
  async SetProductToCart(req: AuthenticatedRequest, res: Response) {
    try {
      const { quantity, productId } = req.body

      const product = await this.cartService.AddProductToCart(
        req.user?.id,
        productId,
        quantity
      )

      return res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Item were added successfully',
        product,
      })
    } catch (error) {
      // console.log(error)
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: error.message,
        })
      }
      if (error instanceof InsufficientStockError) {
        return res.status(400).json({
          ResponseCode: ResponseCodes.Insufficient,
          Message: error.message,
        })
      }
      return InternalServerErrorResponse(res)
    }
  }
  // remove product from cart
  async RemoveProductFromCart(req: AuthenticatedRequest, res: Response) {
    try {
      const productId = parseInt(req.params.id, 10)
      await this.cartService.removeProductFromCart(req.user?.id, productId)
      return res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Deleted successfully',
      })
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }
}
