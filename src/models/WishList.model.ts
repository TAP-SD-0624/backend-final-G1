import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  Model,
} from 'sequelize-typescript'
import { User, Product, WishlistProduct } from '../models'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'wishlists',
  ...defaultTableSettings,
})
export class Wishlist extends Model<Wishlist> {
  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataType.INTEGER })
  userId!: number

  @BelongsTo(() => User)
  user!: User

  @BelongsToMany(() => Product, () => WishlistProduct)
  products!: Product[]
}
