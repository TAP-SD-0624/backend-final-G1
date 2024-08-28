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

  public async getAllCategories(req: Request, res: Response) {
    try {
      const Categories = await this.categoryService.getAllCategories()
      if (!Categories) {
        return res.status(404).json({ error: 'could not find categories' })
      }
      return res.status(200).json(Categories)
    } catch (error: any) {
      res
        .status(500)
        .json({ error: 'Internal server error, please try again later' })
    }
  }

  public async getCategoryByID(req: Request, res: Response) {
    try {
      const categoryId = parseInt(req.params.id, 10)
      if (!categoryId) {
        res.status(500).json({ error: 'Required Data is Unavailable' })
      }
      const category = await this.categoryService.findById(categoryId)
      if (!category) {
        res.status(400).json({ error: 'Category not found' })
      }
      return res.status(201).json(category)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  public async createCategory(req: Request, res: Response) {
    try {
      const category: CategoryDTO = req.body
      if (!category) {
        res.status(500).json({ error: 'Required Data is Unavailable' })
      }
      const newCategory = await this.categoryService.createCategory(category)
      if (!newCategory) {
        res.status(400).json({ error: 'error while creating new Category' })
      }
      return res.status(201).json(newCategory)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  public async updateCategory(req: Request, res: Response) {
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
  public async deleteCategory(req: Request, res: Response) {
    try {
      const deletedId = parseInt(req.params.id, 10)
      if (!deletedId) {
        res.status(500).json({ error: 'Required Data is Unavailable' })
      }
      await this.categoryService.deleteCategory(deletedId)
      return res.status(202)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  //findByName
  public async findByName(req: Request, res: Response) {
    try {
      const { name } = req.body
      if (!name) {
        res.status(500).json({ error: 'name is required' })
      }
      const category = await this.categoryService.findByName(name)
      if (!category) {
        res.status(404).json({ error: 'Category not found' })
      }
      return res.status(201).json(category)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
