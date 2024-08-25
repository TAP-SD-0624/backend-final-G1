import ProductService from '../services/product.service'
import { ProductDTO } from '../Types/DTO'
import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express'
import { UpdateProductDTO } from '../Types/DTO/productDto'
import { GetProductOptions } from '../Types/GetProductOptions'
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
      res.status(200).json({ products })
    } catch (ex) {
      return res
        .status(500)
        .json({ error: 'internal server error, try again later.' })
    }
  }

  public async createProduct(req: Request, res: Response) {
    try {
      const product: ProductDTO = req.body
      product.images = req.files as Express.Multer.File[]
      const newProduct = await this.productService.createProduct(product)

      return res.status(201).json(newProduct)
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: 'internal server error, try again later.' })
    }
  }

  public async updateProduct(req: Request, res: Response) {
    try {
      const updatedData: UpdateProductDTO = req.body

      const updatedProduct = await this.productService.FindAndUpdateProduct(
        updatedData.id,
        updatedData
      )

      if (!updatedProduct) {
        return res
          .status(404)
          .json({ error: 'could not find the product with the specified Id' })
      }

      return res.status(201).json(updatedProduct)
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: 'internal server error, try again later.' })
    }
  }

  public async deleteProduct(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.id)

      const status = await this.productService.DeleteProduct(productId)
      if (status) return res.status(204).json({})
      return res.status(404).json({})
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: 'internal server error, try again later.' })
    }
  }

  public async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params

      const product = await this.productService.GetProduct(parseInt(id))
      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }
      return res.status(200).json({ product })
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: 'internal server error, try again later.' })
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.GetProducts()
      res.status(200).json(products)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
