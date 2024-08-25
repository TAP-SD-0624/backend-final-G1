import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
} from 'sequelize-typescript'
import { User, Product } from '../models'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'userRatings',
  ...defaultTableSettings,
})
export class UserRating extends Model<UserRating> {
  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataType.INTEGER })
  userId!: number

  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.INTEGER })
  productId!: number

  @Column({ allowNull: false, type: DataType.FLOAT })
  rating!: number

  @BelongsTo(() => User)
  user!: User

  @BelongsTo(() => Product)
  product!: Product
}
