import 'reflect-metadata'
import DashboardService from '../services/dashboard.service'
import { dashboardRepository } from '../data-access'
import { InternalServerError } from '../Errors/InternalServerError'
import { GetProductDashboardDTO } from '../Types/DTO'
import { WinstonLogger } from '../helpers/Logger/WinstonLogger'

jest.mock('../data-access/dashboardRepository')
jest.mock('../helpers/Logger/WinstonLogger')

describe('DashboardService', () => {
  let dashboardService: DashboardService

  beforeEach(() => {
    dashboardService = new DashboardService(new WinstonLogger())
    jest.clearAllMocks()
  })

  describe('getMostBoughtProductsOverTime', () => {
    it('should return a list of products - P0', async () => {
      const startTime = new Date()
      const endTime = new Date()
      const products: GetProductDashboardDTO[] = [
        { id: 1, name: 'Product 1', price: 10, stock: 5 },
      ]

      ;(
        dashboardRepository.getMostBoughtProductsOverTime as jest.Mock
      ).mockResolvedValue(products)

      const result = await dashboardService.getMostBoughtProductsOverTime(
        startTime,
        endTime
      )

      expect(
        dashboardRepository.getMostBoughtProductsOverTime
      ).toHaveBeenCalledWith(startTime, endTime)
      expect(result).toEqual(products)
    })

    it('should throw an InternalServerError if an error occurs - P0', async () => {
      const startTime = new Date()
      const endTime = new Date()

      ;(
        dashboardRepository.getMostBoughtProductsOverTime as jest.Mock
      ).mockRejectedValue(new Error('Database error'))

      await expect(
        dashboardService.getMostBoughtProductsOverTime(startTime, endTime)
      ).rejects.toThrow(InternalServerError)
    })
  })

  describe('getProductsNotBought', () => {
    it('should return a list of products not bought - P1', async () => {
      const startTime = new Date()
      const endTime = new Date()
      const products: GetProductDashboardDTO[] = [
        { id: 2, name: 'Product 2', price: 20, stock: 10 },
      ]

      ;(
        dashboardRepository.getProductsNotBought as jest.Mock
      ).mockResolvedValue(products)

      const result = await dashboardService.getProductsNotBought(
        startTime,
        endTime
      )

      expect(dashboardRepository.getProductsNotBought).toHaveBeenCalledWith(
        startTime,
        endTime
      )
      expect(result).toEqual(products)
    })

    it('should throw an InternalServerError if an error occurs - P1', async () => {
      const startTime = new Date()
      const endTime = new Date()

      ;(
        dashboardRepository.getProductsNotBought as jest.Mock
      ).mockRejectedValue(new Error('Database error'))

      await expect(
        dashboardService.getProductsNotBought(startTime, endTime)
      ).rejects.toThrow(InternalServerError)
    })
  })

  describe('DropItemsFromList', () => {
    it('should return true if items are dropped successfully - P1', async () => {
      const ids = [1, 2, 3]

      ;(dashboardRepository.DropItemsFromList as jest.Mock).mockResolvedValue(
        true
      )

      const result = await dashboardService.DropItemsFromList(ids)

      expect(dashboardRepository.DropItemsFromList).toHaveBeenCalledWith(ids)
      expect(result).toBe(true)
    })

    it('should return false if no items are dropped - P1', async () => {
      const ids = [1, 2, 3]

      ;(dashboardRepository.DropItemsFromList as jest.Mock).mockResolvedValue(
        false
      )

      const result = await dashboardService.DropItemsFromList(ids)

      expect(result).toBe(false)
    })

    it('should throw an InternalServerError if an error occurs - P1', async () => {
      const ids = [1, 2, 3]

      ;(dashboardRepository.DropItemsFromList as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(dashboardService.DropItemsFromList(ids)).rejects.toThrow(
        InternalServerError
      )
    })
  })

  describe('getProductsPerState', () => {
    it('should return a list of products for the given state - P1', async () => {
      const state = 'New York'
      const products: GetProductDashboardDTO[] = [
        { id: 3, name: 'Product 3', price: 30, stock: 15 },
      ]

      ;(dashboardRepository.getProductsPerState as jest.Mock).mockResolvedValue(
        products
      )

      const result = await dashboardService.getProductsPerState(state)

      expect(dashboardRepository.getProductsPerState).toHaveBeenCalledWith(
        state
      )
      expect(result).toEqual(products)
    })

    it('should throw an InternalServerError if an error occurs - P1', async () => {
      const state = 'New York'

      ;(dashboardRepository.getProductsPerState as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(dashboardService.getProductsPerState(state)).rejects.toThrow(
        InternalServerError
      )
    })
  })
})
