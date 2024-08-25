import { Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'
import WishlistService from '../services/wishList.service'
import { WishlistDTO } from '../Types/DTO'

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
      const wishlist = await this.wishlistService.getWishlistByUserId(userId)
      return res.json(wishlist)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
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
        return res.status(404).json({ error: 'Product not found' })
      }
      return res.send('Product has been added to wishlist')
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
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
        return res.status(404).json({ error: 'Product not found' })
      }
      return res.send('Product has been removed from the wishlist')
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }
  async clearWishList(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id
      const cleared = await this.wishlistService.clearWishList(userId)
      return res.send('Wishlist has been cleared')
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }
}
