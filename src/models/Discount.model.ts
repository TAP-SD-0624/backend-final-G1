import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Model,
  Max,
  Min,
  Unique,
} from 'sequelize-typescript'
import { Product } from '../models'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'discounts',
  ...defaultTableSettings,
})
export class Discount extends Model<Discount> {
  @Max(100)
  @Min(0)
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  discountRate!: number

  @ForeignKey(() => Product)
  @Unique
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  productId!: number

  @BelongsTo(() => Product)
  product!: Product
}
