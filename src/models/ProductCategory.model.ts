import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
} from 'sequelize-typescript'
import { Product, Category } from '../models'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'productCategory',
  ...defaultTableSettings,
})
export class ProductCategory extends Model<ProductCategory> {
  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.INTEGER })
  productId!: number

  @ForeignKey(() => Category)
  @Column({ allowNull: false, type: DataType.INTEGER })
  categoryId!: number
}
