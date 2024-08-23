import { Address, Order, OrderProduct, Product } from "../models"
import { IDashboardRepository } from "./Interfaces/IDashboardRepository"
import { col, fn, Op, Sequelize } from "sequelize"


export class DashboardRepository implements IDashboardRepository {
  async getMostBoughtProductsOverTime(startTime: Date = new Date(0), endTime: Date = new Date()): Promise<Product[]> {
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
          {
            attributes: ['productId', [Sequelize.fn('COUNT', Sequelize.col('productId')), 'count']],
            model: OrderProduct,
            where: {
              createdAt: {
                [Op.notBetween]: [startTime, endTime],
              }

            }
          }
        ]
      }
    )
    return orders.map((order) => order.get("Product") as Product);
  }
  async DropItemsFromList(ids: number[]): Promise<Boolean> {
    const count = await Product.destroy({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    })
    if (!count) {
      return false;
    }
    return true;
  }
  async getProductsPerState(state: string): Promise<Product[]> {
    const products = await Product.findAll({
      attributes: {
        include: [[fn('COUNT', col('productId')), 'productCount']],
      },
      include: [
        {
          model: Order,
          attributes: [],
          through: {
            attributes: [],
          },
          include: [
            {
              model: Address,
              attributes: [],
              where: {
                state
              }
            }
          ]
        },
      ],
      order: [['productCount', 'DESC']],
    })
    return products;
  }
}