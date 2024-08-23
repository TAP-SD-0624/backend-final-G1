import { updateAddressDTO } from '../Types/DTO'
import { Address } from '../models'
import { IAddressRepository } from './Interfaces'
import { RepositoryBase } from './RepositoryBase'

export class AddressRepository
  extends RepositoryBase<Address>
  implements IAddressRepository
{
  async getAddressByIdAndUserId(
    Id: number,
    userId: number
  ): Promise<Address | null> {
    return await this.model.findOne({ where: { id: Id, userId } })
  }
  async deleteAddress(id: number, userId: number): Promise<boolean> {
    const number = await this.model.destroy({ where: { id, userId } })
    if (!number) {
      return false
    }
    return true
  }
  async updateAddress(
    id: number,
    userId: number,
    data: updateAddressDTO
  ): Promise<Address | null> {
    const obj = { ...data }

    const [_, [updatedEntity]] = await this.model.update(obj, {
      where: { id, userId },
      returning: true,
    })
    return updatedEntity
  }

  async getAddressesByUserId(userId: number): Promise<Address[]> {
    return await this.model.findAll({
      where: { userId },
    })
  }
}
