import { IProductRepository } from './Interfaces'
import {
  Category,
  Discount,
  Product,
  Comment,
  UserRating,
  Brand,
  Image,
} from '../models'
import { RepositoryBase } from './RepositoryBase'
import { GetProductOptions } from '../Types/GetProductOptions'

import { FindOptions, Includeable, IncludeOptions, Op } from 'sequelize'
import { UpdateProductDTO } from '../Types/DTO/productDto'
import sequelize from 'sequelize'

export class ProductRepository
  extends RepositoryBase<Product>
  implements IProductRepository
{
  /**
   * retrieve a product with the specified id.
   * @param {number} id - this is the id of the product we want to retrieve from our Database.
   * @returns {Product | null} returns the products identified with the Id, if not found returns null.
   * @throws {Error} when it fails to retrieve from or connect with the database.
   */

  async GetProduct(id: number): Promise<Product | null> {
    return await this.model.findByPk(id, {
      //include all the necessary nested models when retrieving a single product.
      include: [
        { model: Category, through: { attributes: [] } },
        { model: Discount },
        { model: Comment },
        { model: UserRating },
        { model: Brand },
        { model: Image },
      ],
    })
  }

  /**
   * retrieve a list of products that meets the specification in the options.
   *@param {number} page - this with pageSize will define how many products should be skipped,
   * used to create a pagination pattern. 
   * page starts from 1.

    @param {number} pageSize - will determine the maximum number of products returned,
    used to create a pagination pattern.
    @param {GetProductOptions} options - options that narrows the selection of the returned products.
    @returns {Product[]} returns a list of products that meets the params, returns empty array when there 
    isn't any.
    @throws {Error} when it fails to retrieve from or connect with the database.
   */
  async GetProducts(
    page: number,
    pageSize: number,
    options?: GetProductOptions
  ): Promise<Product[]> {
    // defining the query of selecting the products,
    // first we define the limit by the pageSize, which will limit the number of pages returned.
    // we will also offset it by pageSize * (page - 1), page - 1 since pages starts from 1.
    const opts: FindOptions<Product> = {
      subQuery: false, // Ensure no nested queries are used

      limit: pageSize,

      offset: pageSize * (page - 1),
      where: {
        ...(options?.earliestDate && {
          createdAt: {
            [Op.gt]: options.earliestDate,
          },
        }),
        ...(options?.minPrice && {
          price: {
            [Op.gte]: options.minPrice,
          },
        }),
        ...(options?.maxPrice && {
          price: {
            [Op.lte]: options.maxPrice,
          },
        }),
      },
      attributes: {
        include: [
          [
            sequelize.fn('AVG', sequelize.col('ratings.rating')), // Average rating
            'averageRating',
          ],
          [
            sequelize.fn('COUNT', sequelize.col('ratings.id')), // Count of ratings
            'ratingCount',
          ],
        ],
      },
      include: [
        {
          model: Category,
          ...(options?.categories && {
            where: {
              name: options.categories,
            },
          }),
          through: { attributes: [] },
        },
        {
          model: UserRating,
          attributes: [], // Optionally exclude direct user rating details
        },
        {
          model: Brand,
          ...(options?.brand && {
            where: {
              name: options.brand,
            },
          }),
        },
        {
          model: Image,
        },
      ],
      group: [
        'Product.id', // Group by Product ID
        'categories.id', // Group by Category ID
        'categories->ProductCategory.productId', // Group by productId from ProductCategory
        'categories->ProductCategory.categoryId', // Group by categoryId from ProductCategory
        'ratings.id', // Group by UserRating ID
        'brand.id', // Group by UserRating ID
        'images.id',
      ],
      having: {
        ...(options?.minRating && {
          [Op.gte]: sequelize.literal(
            'AVG(ratings.rating) >= ' + options.minRating
          ),
        }), // Minimum average rating filter
        ...(options?.maxRating && {
          [Op.lte]: sequelize.literal(
            'AVG(ratings.rating) <= ' + options.maxRating
          ),
        }), // Maximum average rating filter
      },
    }

    return await this.model.findAll(opts)
  }

  /**
   *
   * @param {Product} product this wil be an instance of product, need to add the specified categories to the database
   * before adding them to this product, otherwise it will not add those categories to the product.
   * @returns product that was created.
   * @throws Error when failts to create a new instance of connect with the database.
   */
  async CreateProduct(product: Product) {
    //create a new instance based on the values specified.
    const newProduct = await this.model.create(product.dataValues)

    //add the categories to the product.
    await newProduct.$set('categories', product.categories)
    await newProduct.$set('brand', product.brand)
    //save the changes, this will add tuples to the ProductCategory database for each connection
    //between the product and the category.
    await newProduct.save({ returning: true })
    return await this.GetProduct(newProduct.id)
  }
  /**
   *
   * @param productId Id of the product to be updated.
   * @param newValues values need to  be updated.
   * @returns Product if product were found and update were successful, null if was not found
   * @throws {Error} Error when failed to complete the transaction.
   */
  async UpdateProduct(
    productId: number,
    newValues: UpdateProductDTO
  ): Promise<Product | null> {
    const obj = { ...newValues }

    const [_, [updatedEntity]] = await this.model.update(obj, {
      where: { id: productId },
      returning: true,
    })
    return updatedEntity
  }
}
