import { updateAddressDTO } from '../Types/DTO'
import { Address } from '../models'
import { IAddressRepository } from './Interfaces'
import { RepositoryBase } from './RepositoryBase'

export class AddressRepository
  extends RepositoryBase<Address>
  implements IAddressRepository
{
  /**
   *
   * @param id id of the address to be retrieved
   * @param userId id of the user owning this address.
   * @throws Error when it fails to retrieve the data.
   * @returns Address if any found, null otherwise,
   *
   */
  async getAddressByIdAndUserId(
    id: number,
    userId: number
  ): Promise<Address | null> {
    return await this.model.findOne({
      attributes: { exclude: ['userId'] },
      where: { id, userId },
    })
  }

  /**
   *
   * @param id id of the address to be deleted
   * @param userId id of the user owning the address.
   * @throws Error when it fails to delete.
   * @returns true if the deletion were successful, otherwise false.
   *
   */

  async deleteAddress(id: number, userId: number): Promise<boolean> {
    const number = await this.model.destroy({ where: { id, userId } })
    return number > 0
  }

  /**
   *
   * @param id id of the address to be updated
   * @param userId id of the user owning this address.
   * @param data new data for the address to be updated.
   * @throws Error when it fails to update the address.
   * @returns Address when it successfully updates a corresponding address, null otherwise
   */
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

  /**
   *
   * @param userId user Id of the addresses
   * @returns list of addresses for the user.
   */
  async getAddressesByUserId(userId: number): Promise<Address[]> {
    return await this.model.findAll({
      attributes: { exclude: ['userId'] },
      where: { userId },
    })
  }
}
