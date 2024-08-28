import { injectable } from 'tsyringe'
import { Category, Image, Product } from '../models'
import { ProductDTO } from '../Types/DTO'
import { GetProductOptions } from '../Types/GetProductOptions'
import {
  productRepository,
  categoryRepository,
  brandRepository,
  imageRepository,
} from '../data-access'
import { ValidationError } from '../Errors/ValidationError'
import { ValidationError as VE } from 'sequelize'
import { InternalServerError } from '../Errors/InternalServerError'
import { GetProductDTO, UpdateProductDTO } from '../Types/DTO/productDto'
import { WriteAllImages } from '../helpers/Storage/StorageManager'
import { ProductToProductDTO } from '../helpers/Products/ProductToProductDTO'
@injectable()
export default class ProductService {
  /**
   *
   * @param page this with pageSize will define how many products should be skipped,
   * used to create a pagination pattern.
   * pages starts from 1.
   * @default page 1;
   * @param pageSize will determine the maximum number of products returned,
   * @default pageSize 10;
   * @param {GetProductOptions} [options] options that narrows the selection of the returned products.
   * @returns returns a list of productDto that meets the params, returns empty array when there 
    isn't any.
   * @throws {ValidationError} ValidationError when the page or pagesize is less than 1
   * or when the Validation on the Database fails.
   * @throws {InternalServerError} InternalServerError when it fails to retrieve the data.
   */
  async GetProducts(
    page: number = 1,
    pageSize: number = 10,
    options?: GetProductOptions
  ): Promise<GetProductDTO[] | null> {
    //validate the parameters.
    if (page < 1)
      throw new ValidationError('page should be more than or equal to 1')
    if (pageSize < 1)
      throw new ValidationError('pageSize should be more than or equal to 1')

    try {
      //fetch all products from the products repository.
      const products = await productRepository.GetProducts(
        page,
        pageSize,
        options
      )
      const prodcutsDto: GetProductDTO[] = []
      //map each Product with a ProductDTO
      products.forEach((item) => {
        prodcutsDto.push({
          id: item.id,
          averageRating: item.toJSON().averageRating,
          ratingCount: item.toJSON().ratingCount,
          name: item.name,
          price: item.price,
          stock: item.stock,
          brand: item.brand,
          description: item.description,
          discount: {
            discountRate: item.discount?.discountRate ?? 0,
            id: item.discount?.id,
          },
          userRatings: item.ratings.map((item) => ({ value: item.rating })),
          images: item.images,
          categories: item.categories,
        })
      })

      return prodcutsDto
    } catch (ex: unknown) {
      console.log(ex)
      if (ex instanceof VE) throw new ValidationError(ex.message)
      throw new InternalServerError()
    }
  }

  /**
   *
   * @param Id
   * @returns {ProductDTO} productDto which contain the product with the specified Id
   * @returns {null} null when no product is found
   * @throws {InternalServerError} InternalServerError when an error occuers
   */
  async GetProduct(Id: number): Promise<GetProductDTO | null> {
    try {
      const product = await productRepository.GetProduct(Id)
      if (!product) return null

      return ProductToProductDTO(product)
    } catch (ex) {
      console.log(ex)
      throw new InternalServerError()
    }
  }

  /**
   *
   * @param productData Data specified for creating the product
   * @returns created product.
   * @throws {InternalServerError} InternalServerError when it fails to create.
   */

  async createProduct(productData: ProductDTO): Promise<Product | null> {
    try {
      //map the data to the Product.
      const newProduct = new Product()
      newProduct.name = productData.name
      newProduct.price = productData.price
      newProduct.stock = productData.stock
      newProduct.description = productData.description

      const categories: Category[] = []
      productData.categories?.forEach((item) => {
        const cat = new Category()
        cat.name = item.name
        categories.push(cat)
      })

      //first we need to getorcreate the ListOfCategories
      const cats = await categoryRepository.CreateCategoryList(categories)
      newProduct.categories = cats

      //adding the brand.
      const brand = await brandRepository.GetOrCreate(productData.brand ?? '')
      newProduct.brand = brand

      //lets create the product.
      const product = await productRepository.CreateProduct(newProduct)

      if (product) {
        const images = await WriteAllImages(product?.id, productData.images)
        let databaseImages: Image[] = []

        for (let i = 0; i < images.length; i++) {
          const image = new Image()
          image.productId = product.dataValues.id
          image.publicURL = images[i]
          const createdImage = await imageRepository.create(image)
          databaseImages.push(createdImage)
        }
        const data = await productRepository.GetProduct(product.id)
        return data?.toJSON() ?? null
      }
    } catch (ex) {
      console.log(ex)
      throw new InternalServerError()
    }
    return null
  }

  /**
   *
   * @param productId Id of the product want to modify.
   * @param productData new Data for
   * @returns Produced when find and updated successfully
   * @returns null when couldnt find any products with the specified Id
   * @throws {InternalServerError} InternalServerError when an error occured.
   */
  async FindAndUpdateProduct(
    productId: number,
    productData: UpdateProductDTO
  ): Promise<Product | null> {
    try {
      const product = await productRepository.UpdateProduct(
        productId,
        productData
      )
      return product
    } catch (ex) {
      console.log(ex)
      throw new InternalServerError()
    }
  }

  /**
   *
   * @param productId delete the sepecified product with the Id.
   * @returns {boolean} true if the deletion were successful, if not found return false.
   * @throws {InternalServerError} InternalServerError when an error occures.
   */
  async DeleteProduct(productId: number): Promise<boolean> {
    try {
      return await productRepository.delete(productId)
    } catch (error) {
      console.log(error)
      throw new InternalServerError()
    }
  }
}
