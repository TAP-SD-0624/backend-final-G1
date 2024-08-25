import { Table, Column, DataType, HasMany, Model } from 'sequelize-typescript'
import { Cart, Comment, UserRating, Wishlist, Address } from '.'
import { UserRoles } from '../enums/UserRolesEnum'
import { defaultTableSettings } from '../config/DefaultTableSettings'

let userRoles: string[] = []
for (const value in UserRoles) {
  const key = value as keyof typeof UserRoles
  userRoles.push(UserRoles[key])
}

@Table({
  tableName: 'users',
  ...defaultTableSettings,
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string

  @Column({
    type: DataType.ENUM(...userRoles),
    allowNull: false,
    defaultValue: UserRoles.user,
  })
  role!: string

  @HasMany(() => Wishlist)
  wishlists!: Wishlist[]

  @HasMany(() => Cart)
  carts!: Cart[]

  //user-comment relationship.
  @HasMany(() => Comment)
  comments!: Comment[]

  //user-rating relationship.

  @HasMany(() => UserRating)
  ratings!: UserRating[]

  @HasMany(() => Address)
  addresses!: Address[]
}
