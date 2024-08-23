import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,

  Model,
  HasMany,
} from 'sequelize-typescript'
import { User, Order } from '.'
import { defaultTableSettings } from '../config/DefaultTableSettings'


@Table({
  tableName: 'addresses',
  ...defaultTableSettings,
})
export class Address extends Model<Address> {

  @Column({ allowNull: false, type: DataType.STRING })
  state!: string

  @Column({ allowNull: false, type: DataType.STRING })
  city!: string

  @Column({ allowNull: false, type: DataType.STRING })
  street!: string

  @Column({ allowNull: false, type: DataType.STRING })
  firstName!: string

  @Column({ allowNull: false, type: DataType.STRING })
  lastName!: string

  @Column({ allowNull: false, type: DataType.STRING })
  mobileNumber!: string

  @Column({ allowNull: false, type: DataType.STRING })
  email!: string

  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataType.INTEGER })
  userId!: number


  @BelongsTo(() => User)
  user!: User

  @HasMany(() => Order)
  orders!: Order[]
}
