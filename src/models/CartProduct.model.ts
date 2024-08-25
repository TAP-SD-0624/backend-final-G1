import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
} from 'sequelize-typescript'
import { Cart, Product } from '../models'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'cartProduct',
  ...defaultTableSettings,
})
export class CartProduct extends Model<CartProduct> {
  @Column({ allowNull: false, type: DataType.INTEGER })
  quantity!: number

  @ForeignKey(() => Cart)
  @Column
  cartId!: number

  @ForeignKey(() => Product)
  @Column
  productId!: number
}
