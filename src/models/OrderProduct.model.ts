import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
} from 'sequelize-typescript'
import { Product, Order } from '../models'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'orderProduct',
  ...defaultTableSettings,
})
export class OrderProduct extends Model<OrderProduct> {
  @Column({ allowNull: false, type: DataType.INTEGER })
  quantity!: number

  @Column({ allowNull: false, type: DataType.FLOAT })
  totalPrice!: number

  @ForeignKey(() => Order)
  @Column({ allowNull: false, type: DataType.INTEGER })
  orderId!: number

  // @HasOne(() => Order)
  // order!: Order;

  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.INTEGER })
  productId!: number

  // @HasOne(() => Product)
  // product!: Product;
}
