import { Table, Column, DataType, ForeignKey } from "sequelize-typescript";
import ModelBase from "./ModelBase/ModelBase";
import { Cart, Product , User } from "../models";


@Table({
  tableName: "cartProduct",
})
export class CartProduct extends ModelBase<CartProduct> {
  @Column({ allowNull: false, type: DataType.INTEGER })
  quantity!: number;

  @ForeignKey(() => Cart)
  @Column
  cartId!: number;

  @ForeignKey(() => Product)
  @Column
  productId!: number;
}
