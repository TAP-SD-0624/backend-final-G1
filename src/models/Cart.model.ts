import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  Model,
} from 'sequelize-typescript'
import { User, CartProduct, Product } from '../models'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'carts',
  ...defaultTableSettings,
})
export class Cart extends Model<Cart> {
  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataType.INTEGER })
  userId!: number

  @BelongsTo(() => User)
  user!: User

  @BelongsToMany(() => Product, () => CartProduct)
  products!: Product[]
}
