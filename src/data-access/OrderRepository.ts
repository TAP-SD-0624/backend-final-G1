import { Order, Product, User } from '../models'
import { IOrderRepository } from './Interfaces/IOrderRepository'
import { RepositoryBase } from './RepositoryBase'

export class OrderRepository
  extends RepositoryBase<Order>
  implements IOrderRepository
{
  async createOrder(order: Order, productIds: number[]): Promise<Order> {
    const newOrder = await this.model.create(order)
    await newOrder.$add('products', productIds)
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
    return await this.model.findAll({ where: { userId } })
  }
}
