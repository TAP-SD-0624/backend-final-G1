import 'reflect-metadata'
import WishlistService from '../services/wishList.service'
import { wishlistRepository } from '../data-access'
import { WishlistDTO } from '../Types/DTO'
import { InternalServerError } from '../Errors/InternalServerError'
import { WinstonLogger } from '../helpers/Logger/WinstonLogger'

jest.mock('../data-access/wishlistRepository')
jest.mock('../helpers/Logger/WinstonLogger')

describe('WishlistService', () => {
  let wishlistService: WishlistService

  beforeEach(() => {
    wishlistService = new WishlistService(new WinstonLogger())
    jest.clearAllMocks()
  })

  describe('getWishlistByUserId', () => {
    it('should return the wishlist for a given user ID_P0', async () => {
      const userId = 1
      const wishlist: WishlistDTO = { products: [] }

      ;(wishlistRepository.findByUserId as jest.Mock).mockResolvedValue(
        wishlist
      )

      const result = await wishlistService.getWishlistByUserId(userId)

      expect(wishlistRepository.findByUserId).toHaveBeenCalledWith(userId)
      expect(result).toEqual(wishlist)
    })

    it('should return null if no wishlist is found_P1', async () => {
      const userId = 1

      ;(wishlistRepository.findByUserId as jest.Mock).mockResolvedValue(null)

      const result = await wishlistService.getWishlistByUserId(userId)

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs_P1', async () => {
      const userId = 1
      const err = new Error('Database error')

      ;(wishlistRepository.findByUserId as jest.Mock).mockRejectedValue(err)

      await expect(wishlistService.getWishlistByUserId(userId)).rejects.toThrow(
        InternalServerError
      )
    })
  })

  describe('addProductToWishlist', () => {
    it('should add a product to the wishlist and return true_P0', async () => {
      const userId = 1
      const productId = 123

      ;(wishlistRepository.addProductToWishlist as jest.Mock).mockResolvedValue(
        true
      )

      const result = await wishlistService.addProductToWishlist(
        userId,
        productId
      )

      expect(wishlistRepository.addProductToWishlist).toHaveBeenCalledWith(
        userId,
        productId
      )
      expect(result).toBe(true)
    })

    it('should throw an InternalServerError if an error occurs_P1', async () => {
      const userId = 1
      const productId = 123
      const err = new Error('Database error')
      ;(wishlistRepository.addProductToWishlist as jest.Mock).mockRejectedValue(
        err
      )

      await expect(
        wishlistService.addProductToWishlist(userId, productId)
      ).rejects.toThrow(InternalServerError)
    })
  })

  describe('clearWishList', () => {
    it('should clear the wishlist and return true_P0', async () => {
      const userId = 1

      ;(wishlistRepository.clearWishList as jest.Mock).mockResolvedValue(true)

      const result = await wishlistService.clearWishList(userId)

      expect(wishlistRepository.clearWishList).toHaveBeenCalledWith(userId)
      expect(result).toBe(true)
    })

    it('should throw an InternalServerError if an error occurs_P1', async () => {
      const userId = 1
      const err = new Error('Database error')
      ;(wishlistRepository.clearWishList as jest.Mock).mockRejectedValue(err)

      await expect(wishlistService.clearWishList(userId)).rejects.toThrow(
        InternalServerError
      )
    })
  })

  describe('removeProductFromWishList', () => {
    it('should remove a product from the wishlist and return true_P0', async () => {
      const userId = 1
      const productId = 123

      ;(
        wishlistRepository.removeProductFromWishList as jest.Mock
      ).mockResolvedValue(true)

      const result = await wishlistService.removeProductFromWishList(
        userId,
        productId
      )

      expect(wishlistRepository.removeProductFromWishList).toHaveBeenCalledWith(
        userId,
        productId
      )
      expect(result).toBe(true)
    })

    it('should throw an InternalServerError if an error occurs_P1', async () => {
      const userId = 1
      const productId = 123
      const err = new Error('Database error')
      ;(
        wishlistRepository.removeProductFromWishList as jest.Mock
      ).mockRejectedValue(err)

      await expect(
        wishlistService.removeProductFromWishList(userId, productId)
      ).rejects.toThrow(InternalServerError)
    })
  })
})
