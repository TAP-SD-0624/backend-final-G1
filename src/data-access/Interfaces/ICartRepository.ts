import { Cart } from '../../models'
import { IRepositoryBase } from './IRepositoryBase'

export interface ICartRepository extends IRepositoryBase<Cart> {
  findCartByUserId(userId: number): Promise<Cart[]>
  updateCart(id: number, cartData: Cart): Promise<Cart | null>
  deleteCart(id: number): Promise<boolean>
}
