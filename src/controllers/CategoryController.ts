import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'
import CategoryService from '../services/category.service'
import { CategoryDTO } from '../Types/DTO'
import { Category } from '../models'
@injectable()
export class CategoryController {
  constructor(
    @inject(CategoryService) private categoryService: CategoryService
  ) {}

  public async getAllCategories(
    req: Request,
    res: Response
  ): Promise<Category[]> {
    try {
      const Categories = await this.categoryService.getAllCategories()

      res.json(Categories)
      return Categories
    } catch (error: any) {
      res.status(500).json({ error: error.message })
      throw new Error(`Error retrieving categories`)
    }
  }

  public async getCategoryByID(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.id, 10)
      if (!categoryId) {
        res.status(500).json({ error: 'Required Data is Unavailable' })
      }
      const category = await this.categoryService.findById(categoryId)
      if (!category) {
        res.status(400).json({ error: 'Category not found' })
      }
      res.status(201).json(category)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  public async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const category: CategoryDTO = req.body
      if (!category) {
        res.status(500).json({ error: 'Required Data is Unavailable' })
      }
      const newCategory = await this.categoryService.createCategory(category)
      if (!newCategory) {
        res.status(400).json({ error: 'error while creating new Category' })
      }
      res.status(201).json(newCategory)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  public async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const newCategory: CategoryDTO = req.body
      const categoryId = parseInt(req.params.id)
      if (!newCategory || !categoryId) {
        res.status(500).json({ error: 'Required Data is Unavailable' })
      }
      const updatedCategory = await this.categoryService.updateCategory(
        categoryId,
        newCategory
      )
      if (!updatedCategory) {
        res.status(404).json({ error: 'Error while updating category' })
      }
      res.status(201).json(updatedCategory)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  //delete controller
  public async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const deletedId = parseInt(req.params.id, 10)
      if (!deletedId) {
        res.status(500).json({ error: 'Required Data is Unavailable' })
      }
      await this.categoryService.deleteCategory(deletedId)
      res.status(201)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  //findByName
  public async findByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body
      if (!name) {
        res.status(500).json({ error: 'name is required' })
      }
      const category = await this.categoryService.findByName(name)
      if (!category) {
        res.status(404).json({ error: 'Category not found' })
      }
      res.status(201).json(category)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
