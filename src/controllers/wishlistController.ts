import { Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'
import WishlistService from '../services/wishList.service'
import { WishlistDTO } from '../Types/DTO'

@injectable()
export class WishlistController {
  constructor(
    @inject(WishlistService) private wishlistService: WishlistService
  ) {}

  async getWishList(req: Request, res: Response): Promise<WishlistDTO | null> {
    try {
      const userId = (req as any).user.id
      const wishlist = await this.wishlistService.getWishlistByUserId(userId)
      res.json(wishlist)
      return wishlist
    } catch (error: any) {
      res.status(500).json({ error: error.message })
      throw error
    }
  }

  async addProductToWishlist(req: Request, res: Response): Promise<boolean> {
    try {
      const userId = (req as any).user.id
      const productId: number = req.body.productId
      const added = await this.wishlistService.addProductToWishlist(
        userId,
        productId
      )
      if (!added) {
        res.status(404).json({ error: 'Product not found' })
        return false
      }
      res.json('Product has been added to wishlist')
      return added
    } catch (error: any) {
      res.status(500).json({ error: error.message })
      throw error
    }
  }
  async removeProductFromWishlist(
    req: Request,
    res: Response
  ): Promise<boolean> {
    try {
      const userId = (req as any).user.id
      const productId: number = req.params.productId as unknown as number
      const removed = await this.wishlistService.removeProductFromWishList(
        userId,
        productId
      )
      if (!removed) {
        res.status(404).json({ error: 'Product not found' })
        return false
      }
      res.json('Product has been removed from the wishlist')
      return removed
    } catch (error: any) {
      res.status(500).json({ error: error.message })
      throw error
    }
  }
  async clearWishList(req: Request, res: Response): Promise<boolean> {
    try {
      const userId = (req as any).user.id
      const cleared = await this.wishlistService.clearWishList(userId)
      res.json('Wishlist has been cleared')
      return cleared
    } catch (error: any) {
      res.status(500).json({ error: error.message })
      throw error
    }
  }
}
