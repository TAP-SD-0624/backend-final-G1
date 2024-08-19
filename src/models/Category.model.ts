import {
  Table,
  Column,
  DataType,
  BelongsToMany,
  Model,
} from 'sequelize-typescript'
import { Product, ProductCategory } from '../models'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'categories',
  ...defaultTableSettings,
})
export class Category extends Model<Category> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string

  @BelongsToMany(() => Product, () => ProductCategory)
  products!: Product[]
}
