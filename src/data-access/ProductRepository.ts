import { IProductRepository } from "./Interfaces/IProductRepository";
import { Category, Discount, Product, Comment, UserRating } from "../models";
import { RepositoryBase } from "./RepositoryBase";
import { GetProductOptions } from "../Types/GetProductOptions";
import { Op } from "sequelize";

export class ProductRepository
  extends RepositoryBase<Product>
  implements IProductRepository
{
  async GetProduct(id: number) {
    return await this.model.findByPk(id, {
      include: [
        { model: Category, through: { attributes: [] } },
        { model: Discount, through: { attributes: [] } },
        { model: Comment, through: { attributes: [] } },
        { model: UserRating, through: { attributes: [] } },
      ],
    });
  }

  //page starts from 1.
  async GetProducts(
    page: number,
    pageSize: number,
    options: GetProductOptions
  ) {
    return await this.model.findAll({
      limit: pageSize,
      offset: pageSize * (page - 1),
      where: {
        createdAt: {
          [Op.gt]: options.earliestDate ?? Date.now(), // Filter products created after the specified date
        },
      },
      include: [
        {
          model: Category,
          where: { name: options.categories },
          through: { attributes: [] },
        },
      ],
    });
  }

  async findByName(name: string): Promise<Product | null> {
    try {
      const product = await this.model.findOne({
        where: { name },
        include: [
          { model: Category, through: { attributes: [] } },
          { model: UserRating },
          { model: Discount },
        ],
      });
      return product;
    } catch (error: any) {
      throw new Error(`Error retrieving product : ${error.message}`);
    }
  }

  async findByCategory(categoryId: number): Promise<Product[] | null> {
    try {
      const product = await this.model.findAll({
        include: [
          {
            model: Category,
            through: { attributes: [] },
            where: { id: categoryId },
          },
          { model: UserRating },
          { model: Discount },
        ],
      });
      return product;
    } catch (error: any) {
      throw new Error(`Error retrieving product : ${error.message}`);
    }
  }
  async findAllByRating(ratingId: number): Promise<Product[] | null> {
    try {
      const product = await this.model.findAll({
        include: [
          { model: UserRating, where: { ratingId } },
          { model: Category, through: { attributes: [] } },
          { model: Discount },
        ],
      });
      return product;
    } catch (error: any) {
      throw new Error(`Error retrieving product : ${error.message}`);
    }
  }
  async findAllByDiscount(discountId: number): Promise<Product[] | null> {
    try {
      const product = await this.model.findAll({
        include: [
          {
            model: Discount,
            where: { discountId },
          },
          { model: Category, through: { attributes: [] } },
          { model: UserRating },
        ],
      });

      return product;
    } catch (error: any) {
      throw new Error(`Error retrieving product : ${error.message}`);
    }
  }
}
