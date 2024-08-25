import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
} from 'sequelize-typescript'
import { Wishlist, Product } from '../models'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'wishlistProduct',
  ...defaultTableSettings,
})
export class WishlistProduct extends Model<WishlistProduct> {
  @ForeignKey(() => Wishlist)
  @Column({ allowNull: false, type: DataType.INTEGER })
  wishlistId!: number

  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.INTEGER })
  productId!: number
}
