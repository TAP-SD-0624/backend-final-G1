import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Model,
} from 'sequelize-typescript'
import { User, Product } from '../models'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'comments',

  ...defaultTableSettings,
})
export class Comment extends Model<Comment> {
  @Column({ allowNull: false, type: DataType.STRING })
  content!: string

  // Product-comment relationship.
  @ForeignKey(() => Product)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  productId!: number

  @BelongsTo(() => Product)
  product!: Product

  //user-comment relationship.
  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  userId!: number

  @BelongsTo(() => User)
  user!: User
}
