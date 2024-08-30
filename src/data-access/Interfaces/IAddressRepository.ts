import { updateAddressDTO } from '../../Types/DTO'
import { Address } from '../../models'
import { IRepositoryBase } from './IRepositoryBase'

export interface IAddressRepository extends IRepositoryBase<Address> {
  getAddressesByUserId(userId: number): Promise<Address[]>
  updateAddress(
    id: number,
    userId: number,
    data: updateAddressDTO
  ): Promise<Address | null>
  deleteAddress(id: number, userId: number): Promise<boolean>
  getAddressByIdAndUserId(id: number, userId: number): Promise<Address | null>
}
