import ProductService from '../services/product.service'
import { ProductDTO } from '../Types/DTO'
import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'
import { UpdateProductDTO } from '../Types/DTO/productDto'
import { GetProductOptions } from '../Types/GetProductOptions'
import { InternalServerErrorResponse } from '../helpers/DefaultResponses/DefaultResponses'
import { StatusCodes } from 'http-status-codes'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
@injectable()
export class ProductController {
  constructor(@inject(ProductService) private productService: ProductService) {}

  public async GetProducts(req: Request, res: Response) {
    const {
      page,
      pageSize,
      categories,
      earliestDate,
      maxPrice,
      minPrice,
      brand,
      minRating,
      maxRating,
    } = req.query
    const options: GetProductOptions = {
      categories: categories as string[],
      maxPrice: parseFloat(maxPrice as string),
      minPrice: parseFloat(minPrice as string),
      minRating: parseFloat(minRating as string),
      maxRating: parseFloat(maxRating as string),
      brand: brand as string[],
    }
    if (earliestDate) {
      options.earliestDate = new Date(earliestDate as string)
    }
    try {
      const products = await this.productService.GetProducts(
        parseInt(page as string),
        parseInt(pageSize as string),
        options
      )
      res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        products,
      })
    } catch (ex) {
      return InternalServerErrorResponse(res)
    }
  }

  public async createProduct(req: Request, res: Response) {
    try {
      const product: ProductDTO = req.body
      product.images = req.files as Express.Multer.File[]
      const Product = await this.productService.createProduct(product)

      return res.status(StatusCodes.CREATED).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'success',
        Product,
      })
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }

  public async updateProduct(req: Request, res: Response) {
    try {
      const updatedData: UpdateProductDTO = req.body

      const Product = await this.productService.FindAndUpdateProduct(
        updatedData.id,
        updatedData
      )

      if (!Product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'could not find the product with the specified Id',
        })
      }

      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Product,
      })
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }

  public async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params

      const status = await this.productService.DeleteProduct(
        id as unknown as number
      )
      if (status)
        return res.status(StatusCodes.NO_CONTENT).json({
          ResponseCode: ResponseCodes.Success,
          Message: 'Successfully deleted the product.',
        })
      return res.status(StatusCodes.NOT_FOUND).json({
        ResponseCode: ResponseCodes.NotFound,
        Message: 'Could not find the specified product.',
      })
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }

  public async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const product = await this.productService.GetProduct(
        id as unknown as number
      )
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Could not find the specified product.',
        })
      }
      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Successfully deleted the product.',
        product,
      })
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await this.productService.GetProducts()
      res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        products,
      })
    } catch (error: any) {
      return InternalServerErrorResponse(res)
    }
  }
}
