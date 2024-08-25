import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Model,
} from 'sequelize-typescript'
import { User, Product } from '.'
import { defaultTableSettings } from '../config/DefaultTableSettings'

const { paranoid, timestamps } = defaultTableSettings
@Table({
  tableName: 'images',
  paranoid,
  timestamps,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt', 'productId'],
    },
  },
})
export class Image extends Model<Image> {
  @Column({ allowNull: false, type: DataType.STRING })
  publicURL!: string

  // Product-comment relationship.
  @ForeignKey(() => Product)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  productId!: number

  @BelongsTo(() => Product)
  product!: Product
}
