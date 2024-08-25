import 'reflect-metadata'
import CategoryService from '../services/category.service'
import { categoryRepository } from '../data-access'
import { CategoryDTO } from '../Types/DTO/categoryDto'
import { InternalServerError } from '../Errors/InternalServerError'
import logger from '../helpers/logger'
import { Category } from '../models'

jest.mock('../data-access/categoryRepository')
jest.mock('../helpers/logger')

describe('CategoryService', () => {
  let categoryService: CategoryService

  beforeEach(() => {
    categoryService = new CategoryService()
    jest.clearAllMocks()
  })

  describe('createCategory', () => {
    it('should create and return a category', async () => {
      const categoryData: CategoryDTO = {
        name: 'Electronics',
      }

      const mockCategory = new Category()
      mockCategory.id = 1
      mockCategory.name = categoryData.name
      ;(categoryRepository.create as jest.Mock).mockResolvedValue(mockCategory)

      const result = await categoryService.createCategory(categoryData)

      expect(categoryRepository.create).toHaveBeenCalledWith(expect.anything())
      expect(result).toEqual(mockCategory)
    })

    it('should throw an error if creation fails', async () => {
      const categoryData: CategoryDTO = {
        name: 'Electronics',
      }

      ;(categoryRepository.create as jest.Mock).mockResolvedValue(null)

      await expect(
        categoryService.createCategory(categoryData)
      ).rejects.toThrow('an error occurred, please try again later')
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const categoryData: CategoryDTO = {
        name: 'Electronics',
      }

      ;(categoryRepository.create as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        categoryService.createCategory(categoryData)
      ).rejects.toThrow('an error occurred, please try again later')
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('updateCategory', () => {
    it('should update and return the updated category', async () => {
      const categoryId = 1
      const updateData: CategoryDTO = { name: 'Updated Electronics' }

      const mockCategory = new Category()
      mockCategory.id = categoryId
      mockCategory.name = updateData.name
      ;(categoryRepository.findById as jest.Mock).mockResolvedValue(
        mockCategory
      )
      ;(categoryRepository.update as jest.Mock).mockResolvedValue(mockCategory)

      const result = await categoryService.updateCategory(
        categoryId,
        updateData
      )

      expect(categoryRepository.findById).toHaveBeenCalledWith(categoryId)
      expect(categoryRepository.update).toHaveBeenCalledWith(mockCategory)
      expect(result).toEqual(mockCategory)
    })

    it('should throw an error if category does not exist', async () => {
      const categoryId = 1
      const updateData: CategoryDTO = { name: 'Updated Electronics' }

      ;(categoryRepository.findById as jest.Mock).mockResolvedValue(null)

      await expect(
        categoryService.updateCategory(categoryId, updateData)
      ).rejects.toThrow('an error occurred, please try again later')
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const categoryId = 1
      const updateData: CategoryDTO = { name: 'Updated Electronics' }

      ;(categoryRepository.findById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        categoryService.updateCategory(categoryId, updateData)
      ).rejects.toThrow('an error occurred, please try again later')
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('findById', () => {
    it('should return a category by its ID', async () => {
      const categoryId = 1
      const mockCategory = new Category()
      mockCategory.id = categoryId
      mockCategory.name = 'Electronics'
      ;(categoryRepository.findById as jest.Mock).mockResolvedValue(
        mockCategory
      )

      const result = await categoryService.findById(categoryId)

      expect(categoryRepository.findById).toHaveBeenCalledWith(categoryId)
      expect(result).toEqual(mockCategory)
    })

    it('should return null if the category is not found', async () => {
      const categoryId = 1

      ;(categoryRepository.findById as jest.Mock).mockResolvedValue(null)

      const result = await categoryService.findById(categoryId)

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const categoryId = 1

      ;(categoryRepository.findById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(categoryService.findById(categoryId)).rejects.toThrow(
        'an error occurred, please try again later'
      )
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('getAllCategories', () => {
    it('should return a list of categories', async () => {
      const mockCategories: Category[] = [
        { id: 1, name: 'Electronics' } as Category,
        { id: 2, name: 'Clothing' } as Category,
      ]

      ;(categoryRepository.findAll as jest.Mock).mockResolvedValue(
        mockCategories
      )

      const result = await categoryService.getAllCategories()

      expect(categoryRepository.findAll).toHaveBeenCalled()
      expect(result).toEqual(mockCategories)
    })

    it('should return an empty array if no categories are found', async () => {
      ;(categoryRepository.findAll as jest.Mock).mockResolvedValue([])

      const result = await categoryService.getAllCategories()

      expect(result).toEqual([])
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      ;(categoryRepository.findAll as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(categoryService.getAllCategories()).rejects.toThrow(
        'an error occurred, please try again later'
      )
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('findByName', () => {
    it('should return a category by its name', async () => {
      const categoryName = 'Electronics'
      const mockCategory = new Category()
      mockCategory.id = 1
      mockCategory.name = categoryName
      ;(categoryRepository.findByName as jest.Mock).mockResolvedValue(
        mockCategory
      )

      const result = await categoryService.findByName(categoryName)

      expect(categoryRepository.findByName).toHaveBeenCalledWith(categoryName)
      expect(result).toEqual(mockCategory)
    })

    it('should return null if the category is not found', async () => {
      const categoryName = 'Electronics'

      ;(categoryRepository.findByName as jest.Mock).mockResolvedValue(null)

      const result = await categoryService.findByName(categoryName)

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const categoryName = 'Electronics'

      ;(categoryRepository.findByName as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(categoryService.findByName(categoryName)).rejects.toThrow(
        'an error occurred, please try again later'
      )
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('deleteCategory', () => {
    it('should delete the category and return true', async () => {
      const categoryId = 1

      ;(categoryRepository.delete as jest.Mock).mockResolvedValue(true)

      const result = await categoryService.deleteCategory(categoryId)

      expect(categoryRepository.delete).toHaveBeenCalledWith(categoryId)
      expect(result).toBe(true)
    })

    it('should return false if the category is not deleted', async () => {
      const categoryId = 1

      ;(categoryRepository.delete as jest.Mock).mockResolvedValue(false)

      const result = await categoryService.deleteCategory(categoryId)

      expect(result).toBe(false)
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const categoryId = 1

      ;(categoryRepository.delete as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(categoryService.deleteCategory(categoryId)).rejects.toThrow(
        'an error occurred, please try again later'
      )
      expect(logger.error).toHaveBeenCalled()
    })
  })
})
