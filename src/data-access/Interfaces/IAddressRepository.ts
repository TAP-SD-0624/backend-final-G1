import { updateAddressDTO } from "../../Types/DTO";
import { Address } from "../../models";


export interface IAddressRepository {
  getAddressesByUserId(userId: number): Promise<Address[]>
  updateAddress(id: number, userId: number, data: updateAddressDTO): Promise<Address | null>
  deleteAddress(id: number, userId: number): Promise<boolean>
  getAddressByIdAndUserId(Id: number, userId: number): Promise<Address | null>
}