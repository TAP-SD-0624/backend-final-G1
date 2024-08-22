import {
  Table,
  Column,
  Model,
  HasMany,
  AllowNull,
  Unique,
} from 'sequelize-typescript'
import { Product } from '../models'
import { DataTypes } from 'sequelize'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'brands',
  ...defaultTableSettings,
})
export class Brand extends Model<Brand> {
  //the name field will be unique accross all brands, and will be used as an identification for each brand.
  @AllowNull(false)
  @Unique
  @Column({ type: DataTypes.STRING })
  name!: string

  //the icon will be for the brand.
  @Column({ type: DataTypes.STRING })
  icon!: string

  //prodcuts reference, it is a one-to-many relationship with products.
  @HasMany(() => Product)
  prodcuts!: Product[]
}
