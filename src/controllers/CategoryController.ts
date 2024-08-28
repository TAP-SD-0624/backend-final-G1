import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'
import CategoryService from '../services/category.service'
import { CategoryDTO } from '../Types/DTO'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
import { StatusCodes } from 'http-status-codes'
@injectable()
export class CategoryController {
  constructor(
    @inject(CategoryService) private categoryService: CategoryService
  ) {}

  public async getAllCategories(req: Request, res: Response) {
    try {
      const Categories = await this.categoryService.getAllCategories()

      return res.json({
        Responsecode: ResponseCodes.Success,
        Message: 'Success',
        Categories,
      })
    } catch (error: any) {
      return res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error, please try again later.',
      })
    }
  }

  public async getCategoryByID(req: Request, res: Response) {
    try {
      const { id } = req.params
      const Category = await this.categoryService.findById(
        id as unknown as number
      )
      if (!Category) {
        return res.status(StatusCodes.NOT_FOUND).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Could not find the category with the provided Id.',
        })
      }

      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Category,
      })
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error, please try again later.',
      })
    }
  }

  public async createCategory(req: Request, res: Response) {
    try {
      const categoryDTO = req.body as CategoryDTO
      const Category = await this.categoryService.createCategory(categoryDTO)

      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Category,
      })
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error, please try again later.',
      })
    }
  }

  public async updateCategory(req: Request, res: Response) {
    try {
      const newCategory: CategoryDTO = req.body
      const { id } = req.params
      const Category = await this.categoryService.updateCategory(
        id as unknown as number,
        newCategory
      )

      if (!Category) {
        res.status(StatusCodes.NOT_FOUND).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Cound not find the category with the provided id.',
        })
      }
      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Category,
      })
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error, please try again later.',
      })
    }
  }

  //delete controller
  public async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params

      await this.categoryService.deleteCategory(id as unknown as number)
      return res
        .status(StatusCodes.OK)
        .json({ ResponseCode: ResponseCodes.Success, Message: 'Success' })
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error, please try again later.',
      })
    }
  }

  //findByName
  public async findByName(req: Request, res: Response) {
    try {
      const { name } = req.body
      const Category = await this.categoryService.findByName(name)
      if (!Category) {
        res.status(StatusCodes.NOT_FOUND).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Could not find the category with the provided name.',
        })
      }
      res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Category,
      })
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error, please try again later.',
      })
    }
  }
}
