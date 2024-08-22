import { Product } from '../../models'
import { OrderStatus } from '../../enums/OrderStatusEnum'

export type OrderDTO = {
  id?: number
  status: OrderStatus
  isPaid: boolean
  products: Product[]
}
