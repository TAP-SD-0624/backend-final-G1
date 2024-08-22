import { Order, OrderProduct, Product } from "../models"
import { IDashboardRepository } from "./Interfaces/IDashboardRepository"
import { Op, Sequelize } from "sequelize"


export class DashboardRepository implements IDashboardRepository {
  async getMostBoughtProductsOverTime(startTime: Date, endTime: Date): Promise<Product[]> {
    const orders = await OrderProduct.findAll({
      attributes: ['productId', [Sequelize.fn('COUNT', Sequelize.col('productId')), 'count']],
      where: {
        createdAt: {
          [Op.between]: [startTime, endTime],
        }
      },
      group: ['productId'],
      include: [
        {
          model: Product,

        }
      ],
      order: [['count', 'DESC']],
    })
    return orders.map((order) => order.get("Product") as Product);
  }
  async getProductsNotBought(startTime: Date = new Date(0), endTime: Date = new Date()): Promise<Product[]> {
    const orders = await Product.findAll(
      {
        include: [
          { model: OrderProduct }
        ]
      }
    )


    await OrderProduct.findAll({
      attributes: ['productId', [Sequelize.fn('COUNT', Sequelize.col('productId')), 'count']],
      where: {
        createdAt: {
          [Op.between]: [startTime, endTime],
        }
      },
      group: ['productId'],
      include: [
        {
          model: Product,

        }
      ],
    })
    return orders.map((order) => order.get("Product") as Product);
  }
  getListOfItemsToDrop(): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }
  getProductsPerCountry(country: string): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }
}