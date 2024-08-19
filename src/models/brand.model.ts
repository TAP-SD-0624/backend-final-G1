import {
  Table,
  Column,
  Model,
  HasMany,
  NotNull,
  AllowNull,
  DataType,
  ForeignKey,
} from 'sequelize-typescript'
import { Product, Wishlist } from '../models'
import { DataTypes } from 'sequelize'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'brands',
  ...defaultTableSettings,
})
export class Brand extends Model<Brand> {
  @AllowNull(false)
  @Column({ type: DataTypes.STRING })
  name!: string

  @HasMany(() => Product)
  brands!: Product[]
}
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
