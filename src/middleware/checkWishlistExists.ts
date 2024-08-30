import { NextFunction, Request, Response } from 'express'
import { wishlistRepository } from '../data-access'
import { Wishlist } from '../models'
import { AuthenticatedRequest } from '../helpers/AuthenticatedRequest'
export async function checkWishlistExists(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.id
  try {
    const exists = await wishlistRepository.wishlistExists(userId)
    if (!exists) {
      const wishlist = new Wishlist()
      wishlist.userId = userId
      await wishlistRepository.create(wishlist)
    }
  } catch (error: unknown) {
    throw error
  }
  next()
}
