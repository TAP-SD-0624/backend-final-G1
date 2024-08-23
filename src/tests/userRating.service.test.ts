import 'reflect-metadata'
import { UserRatingService } from '../services/userRating.service'
import { userRatingRepository } from '../data-access'
import { UserRatingDTO } from '../Types/DTO'
import { InternalServerError } from '../Errors/InternalServerError'
import logger from '../helpers/logger'
import { UserRating } from '../models'

jest.mock('../data-access/UserRatingRepository')
jest.mock('../helpers/logger')

describe('UserRatingService', () => {
  let userRatingService: UserRatingService

  beforeEach(() => {
    userRatingService = new UserRatingService()
    jest.clearAllMocks()
  })

  describe('createUserRating', () => {
    it('should create and return a user rating', async () => {
      const userId = 1
      const productId = 123
      const userRatingData: UserRatingDTO = {
        productId,
        rating: 4,
      }

      const userRating = new UserRating()
      userRating.userId = userId
      userRating.productId = productId
      userRating.rating = 4
      ;(userRatingRepository.create as jest.Mock).mockResolvedValue(userRating)

      const result = await userRatingService.createUserRating(
        userId,
        userRatingData
      )

      expect(userRatingRepository.create).toHaveBeenCalledWith(
        expect.any(UserRating)
      )
      expect(result).toEqual(userRatingData)
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const userId = 1
      const productId = 123
      const userRatingData: UserRatingDTO = {
        productId,
        rating: 4,
      }

      ;(userRatingRepository.create as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        userRatingService.createUserRating(userId, userRatingData)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('findUserRatingsByProductId', () => {
    it('should return the average rating for a product', async () => {
      const productId = 123
      const userRatings: UserRating[] = [new UserRating(), new UserRating()]
      userRatings[0].rating = 4
      userRatings[1].rating = 5
      ;(userRatingRepository.findAllByProductId as jest.Mock).mockResolvedValue(
        userRatings
      )

      const result =
        await userRatingService.findUserRatingsByProductId(productId)

      expect(userRatingRepository.findAllByProductId).toHaveBeenCalledWith(
        productId
      )
      expect(result).toEqual(4.5)
    })

    it('should return 0 if no ratings are found', async () => {
      const productId = 123

      ;(userRatingRepository.findAllByProductId as jest.Mock).mockResolvedValue(
        []
      )

      const result =
        await userRatingService.findUserRatingsByProductId(productId)

      expect(result).toEqual(0)
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const productId = 123

      ;(userRatingRepository.findAllByProductId as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        userRatingService.findUserRatingsByProductId(productId)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('findUserRatingByUserIdAndProductId', () => {
    it('should return a user rating for the given user and product', async () => {
      const userId = 1
      const productId = 123
      const userRating = new UserRating()
      userRating.toJSON = jest.fn().mockReturnValue({ rating: 4, productId })
      ;(
        userRatingRepository.findByUserIdAndProductId as jest.Mock
      ).mockResolvedValue(userRating)

      const result = await userRatingService.findUserRatingByUserIdAndProductId(
        userId,
        productId
      )

      expect(
        userRatingRepository.findByUserIdAndProductId
      ).toHaveBeenCalledWith(userId, productId)
      expect(result).toEqual({ rating: 4, productId })
    })

    it('should return null if no rating is found', async () => {
      const userId = 1
      const productId = 123

      ;(
        userRatingRepository.findByUserIdAndProductId as jest.Mock
      ).mockResolvedValue(null)

      const result = await userRatingService.findUserRatingByUserIdAndProductId(
        userId,
        productId
      )

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const userId = 1
      const productId = 123

      ;(
        userRatingRepository.findByUserIdAndProductId as jest.Mock
      ).mockRejectedValue(new Error('Database error'))

      await expect(
        userRatingService.findUserRatingByUserIdAndProductId(userId, productId)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('updateUserRating', () => {
    it('should update and return the updated user rating', async () => {
      const userId = 1
      const productId = 123
      const userRatingData: UserRatingDTO = { rating: 5, productId }
      const updatedUserRating = new UserRating()
      updatedUserRating.rating = 5
      updatedUserRating.userId = userId
      updatedUserRating.productId = productId
      ;(userRatingRepository.updateUserRating as jest.Mock).mockResolvedValue(
        updatedUserRating
      )

      const result = await userRatingService.updateUserRating(
        userId,
        userRatingData
      )

      expect(result).toEqual({ rating: 5, productId })
    })

    it('should return null if the user rating is not found', async () => {
      const userId = 1
      const productId = 123
      const userRatingData: UserRatingDTO = { rating: 5, productId }
      ;(userRatingRepository.updateUserRating as jest.Mock).mockResolvedValue(
        null
      )

      const result = await userRatingService.updateUserRating(
        userId,
        userRatingData
      )

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const userId = 1
      const productId = 123
      const userRatingData: UserRatingDTO = { rating: 5, productId }

      ;(userRatingRepository.updateUserRating as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        userRatingService.updateUserRating(userId, userRatingData)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalled()
    })
  })
})
