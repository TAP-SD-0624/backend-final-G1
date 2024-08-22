import { Order } from '../../models'
import { IRepositoryBase } from './IRepositoryBase'

export interface IOrderRepository extends IRepositoryBase<Order> {
  findByUserId(userId: number): Promise<Order[] | null>
  findByIdAndUserId(id: number, userId: number): Promise<Order | null>
  findByUserId(userId: number): Promise<Order[] | null>
}
