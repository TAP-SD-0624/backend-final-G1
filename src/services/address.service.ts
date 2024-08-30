import { AddressDTO, updateAddressDTO } from '../Types/DTO'
import { InternalServerError } from '../Errors'
import { addressRepository } from '../data-access'
import { inject, injectable } from 'tsyringe'
import { Address } from '../models'
import { ILogger } from '../helpers/Logger/ILogger'

@injectable()
export default class AddressService {
  constructor(@inject('ILogger') private logger: ILogger) {}

  /**
   * @param {number} id id of the address
   * @param {number} userId id of the u user owning this address
   * @returns {AddressDTO} AddressDTO when it finds the address
   * @returns {null} null when it didn't find the address for this user.
   * @throws {InternalServerError} InternalServerError when it fails to get the address.
   * @returns
   */

  public async getAddressByIdAndUserId(
    id: number,
    userId: number
  ): Promise<AddressDTO | null> {
    try {
      return await addressRepository.getAddressByIdAndUserId(id, userId)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError('an error occurred, please try again later')
    }
  }

  /**
   *
   * @param {number} userId id of the user having the addresses
   * @throws {InternalServerError} InternalServerError when it fails to retrieve the list of addresses
   * @returns {AddressDTO[]} list of AddressDTO containing all addressing owned by this user.
   */

  public async getAddressesByUserId(userId: number): Promise<AddressDTO[]> {
    try {
      return await addressRepository.getAddressesByUserId(userId)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }
  /**
   *
   * @param userId id of the user will own the address.
   * @param {AddressDTO} data data related with the address.
   *@throws {InternalServerError} when it fails to create a new address
   * @returns {AddressDTO} Address that was created
   */
  public async createAddress(
    userId: number,
    data: AddressDTO
  ): Promise<AddressDTO> {
    const address = new Address()
    address.street = data.street
    address.city = data.city
    address.email = data.email
    address.firstName = data.firstName
    address.lastName = data.lastName
    address.mobileNumber = data.mobileNumber
    address.state = data.state
    address.userId = userId
    try {
      const newAddress = await addressRepository.create(address)
      const data: AddressDTO = { ...newAddress }

      return data
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }

  /**
   *
   * @param  {number} id id of the address to update.
   * @param {number} userId id of the user owning this address.
   * @param {updateAddressDTO} data different data related to the address wanting to be updated.
   * @throws {InternalServerError} InternalServerError when it fails to update the address.
   * @returns {AddressDTO | null} returns addressDTO if an associate address were found, otherwise, returns null.
   */
  public async updateAddress(
    id: number,
    userId: number,
    data: updateAddressDTO
  ): Promise<AddressDTO | null> {
    delete (data as any).id

    try {
      const updatedAddress = await addressRepository.updateAddress(
        id,
        userId,
        data
      )
      if (!updatedAddress) return null
      const updatedAddressJSON: AddressDTO = updatedAddress.toJSON()
      delete updatedAddressJSON.userId
      delete updatedAddressJSON.createdAt
      delete updatedAddressJSON.updatedAt
      delete updatedAddressJSON.deletedAt
      return updatedAddressJSON
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }

  /**
   *
   * @param {number} id id of the address being deleted.
   * @param {number} userId id of the user owning this address.
   * @throws {InternalServerError} InternalServerErrorr when it fails to delete the address.
   * @returns {boolean} true if the deletion were successful, otherwise, returns false.
   */
  public async deleteAddress(id: number, userId: number): Promise<boolean> {
    try {
      return await addressRepository.deleteAddress(id, userId)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }
}
