import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  Model,
} from 'sequelize-typescript'
import { Product, OrderProduct, User } from '../models'
import { OrderStatus } from '../enums/OrderStatusEnum'
import { defaultTableSettings } from '../config/DefaultTableSettings'

let orderStatus: string[] = []
for (const value in OrderStatus) {
  const key = value as keyof typeof OrderStatus
  orderStatus.push(OrderStatus[key])
}

@Table({
  tableName: 'orders',
  ...defaultTableSettings,
})
export class Order extends Model<Order> {
  @Column({ allowNull: false, type: DataType.ENUM(...orderStatus) })
  status!: string

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  isPaid!: boolean

  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataType.INTEGER })
  userId!: number

  @BelongsTo(() => User)
  user!: User

  @BelongsToMany(() => Product, () => OrderProduct)
  products!: Product[]
}
