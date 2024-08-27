import { Transaction } from 'sequelize'
import { Order, Product, User, OrderProduct, Address } from '../models'
import { IOrderRepository } from './Interfaces/IOrderRepository'
import { RepositoryBase } from './RepositoryBase'

export class OrderRepository
  extends RepositoryBase<Order>
  implements IOrderRepository
{
  async createOrder(
    order: Order,
    products: Product[],
    transaction: Transaction
  ): Promise<Order> {
    const newOrder = await this.model.create(order.dataValues, {
      transaction: transaction,
    })

    await Promise.all(
      products.map(async (item) => {
        const orderProduct = new OrderProduct()
        ;(orderProduct.productId = item.id),
          (orderProduct.orderId = newOrder.id),
          (orderProduct.quantity = item.CartProduct.quantity)
        orderProduct.totalPrice =
          item.price *
          (item as any).CartProduct.quantity *
          ((100 - (item.discount?.discountRate ?? 0)) / 100)
        await OrderProduct.create(orderProduct.dataValues, {
          transaction: transaction,
        })
      })
    )
    return newOrder
  }

  async findByIdAndUserId(id: number, userId: number): Promise<Order | null> {
    return await this.model.findOne({
      where: { id, userId },
      include: [
        {
          attributes: { exclude: ['password'] },
          model: User,
        },
        {
          model: Product,
          through: {
            attributes: ['quantity', 'totalPrice'],
          },
        },
      ],
    })
  }
  async findByUserId(userId: number): Promise<Order[] | null> {
    return await this.model.findAll({
      where: { userId },
      include: [
        {
          model: Address,
        },
        {
          model: Product,
        },
      ],
    })
  }
}
