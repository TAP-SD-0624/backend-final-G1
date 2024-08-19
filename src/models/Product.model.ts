import {
  Table,
  Column,
  DataType,
  HasOne,
  BelongsToMany,
  HasMany,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript'
import {
  Discount,
  Category,
  Comment,
  UserRating,
  Wishlist,
  Cart,
  OrderProduct,
  ProductCategory,
  Order,
  CartProduct,
  WishlistProduct,
  Image,
} from '../models'
import { Brand } from './brand.model'
import { defaultTableSettings } from '../config/DefaultTableSettings'

@Table({
  tableName: 'products',
  ...defaultTableSettings,
})
export class Product extends Model<Product> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price!: number

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  stock!: number

  //Product-Discount relationship.
  @HasOne(() => Discount)
  discount?: Discount

  //Product-Category relationship.
  @BelongsToMany(() => Category, () => ProductCategory)
  categories!: Category[]

  //product-image relationship
  @HasMany(() => Image)
  images!: Image[]

  //Prodcut-Comment relationshop.

  @HasMany(() => Comment)
  comments!: Comment[]

  @HasMany(() => UserRating)
  ratings!: UserRating[]

  @BelongsToMany(() => Wishlist, () => WishlistProduct)
  Wishlists!: Wishlist[]

  @BelongsToMany(() => Cart, () => CartProduct)
  carts!: Cart[]

  @BelongsToMany(() => Order, () => OrderProduct)
  Orders!: Order[]

  @ForeignKey(() => Brand)
  brandId!: number

  @BelongsTo(() => Brand)
  brand!: Brand

  // Override destroy method to cascade soft delete
  async destroy(options?: any) {
    // Call the original destroy method
    await super.destroy(options)

    // Soft delete related ProductCategory records
    await ProductCategory.update(
      { deletedAt: new Date() }, // Set deletedAt to now
      { where: { productId: this.id }, individualHooks: true } // Filter by current product
    )
  }
}
