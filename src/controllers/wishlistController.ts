import { Request, response, Response } from 'express'
import { injectable, inject } from 'tsyringe'
import WishlistService from '../services/wishList.service'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
import { InternalServerErrorResponse } from '../helpers/DefaultResponses/DefaultResponses'
import { StatusCodes } from 'http-status-codes'

@injectable()
export class WishlistController {
  constructor(
    @inject(WishlistService) private wishlistService: WishlistService
  ) {}

  async addOrRemoveProducts(req: Request, res: Response) {
    const mode = req.body.mode
    if (mode === 'add') {
      return this.addProductToWishlist(req, res)
    } else {
      return this.removeProductFromWishlist(req, res)
    }
  }
  async getWishList(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id
      const Wishlist = await this.wishlistService.getWishlistByUserId(userId)
      return res.json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Wishlist,
      })
    } catch (error: unknown) {
      return InternalServerErrorResponse(res)
    }
  }

  private async addProductToWishlist(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id
      const productId = req.body.productId as unknown as number
      const added = await this.wishlistService.addProductToWishlist(
        userId,
        productId
      )
      if (!added) {
        return res.status(StatusCodes.NOT_FOUND).json({
          ResponseCodes: ResponseCodes.NotFound,
          Message: 'Product not found',
        })
      }
      return res.send({
        ResponseCode: ResponseCodes.Success,
        Message: 'Product has been added to wishlist',
      })
    } catch (error: unknown) {
      return InternalServerErrorResponse(res)
    }
  }
  async removeProductFromWishlist(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id
      const productId: number = req.body.productId as unknown as number
      const removed = await this.wishlistService.removeProductFromWishList(
        userId,
        productId
      )
      if (!removed) {
        return res.status(StatusCodes.NOT_FOUND).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Product not found',
        })
      }
      return res.status(StatusCodes.NO_CONTENT).send({
        ResponseCode: ResponseCodes.Success,
        Message: 'Deleted successfully',
      })
    } catch (error: unknown) {
      return InternalServerErrorResponse(res)
    }
  }
  async clearWishList(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id
      const cleared = await this.wishlistService.clearWishList(userId)
      return res.send({
        ResponseCode: ResponseCodes.Success,
        Message: 'Wishlist has been cleared',
      })
    } catch (error: unknown) {
      return InternalServerErrorResponse(res)
    }
  }
}
