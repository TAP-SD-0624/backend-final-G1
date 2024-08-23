import { AddressDTO, updateAddressDTO } from "../Types/DTO";
import { InternalServerError } from "../Errors/InternalServerError";
import { addressRepository } from "../data-access";
import logger from "../helpers/logger";
import { injectable } from "tsyringe";
import { Address } from "../models";
import { ValidationError as VE } from "sequelize";
import { ValidationError } from "../Errors/ValidationError";


@injectable()
export default class AddressService {

  public async getAddressByIdAndUserId(Id: number, userId: number): Promise<AddressDTO | null> {

    try {
      return await addressRepository.getAddressByIdAndUserId(Id, userId);
    }
    catch (error) {
      logger.error(error);
      throw new InternalServerError('an error occurred, please try again later');

    }
  }

  public async getAddressesByUserId(userId: number): Promise<AddressDTO[]> {
    try {
      const addresses = await addressRepository.getAddressesByUserId(userId);
      return addresses;
    }
    catch (error) {
      logger.error(error);
      if (error instanceof VE) { throw new ValidationError(error.message); }
      throw new InternalServerError('an error occurred, please try again later');
    }
  }

  public async createAddress(userId: number, data: AddressDTO): Promise<AddressDTO> {
    const address = new Address();
    address.street = data.street;
    address.city = data.city;
    address.email = data.email;
    address.firstName = data.firstName;
    address.lastName = data.lastName;
    address.mobileNumber = data.mobileNumber;
    address.state = data.state;
    address.userId = userId;
    try {
      await addressRepository.create(address);
      return address;
    }
    catch (error) {
      logger.error(error);
      if (error instanceof VE) { throw new ValidationError(error.message); }
      throw new InternalServerError('an error occurred, please try again later');
    }
  }

  public async updateAddress(id: number, userId: number, data: updateAddressDTO): Promise<AddressDTO | null> {
    delete (data as any).id;
    try {
      return await addressRepository.updateAddress(id, userId, data);
      
    }
    catch (error) {
      logger.error(error);
      if (error instanceof VE) { throw new ValidationError(error.message); }
      throw new InternalServerError('an error occurred, please try again later');
    }
  }

  public async deleteAddress(id: number, userId: number): Promise<boolean> {

    try {
      return addressRepository.deleteAddress(id, userId);
    }
    catch (error) {
      throw new InternalServerError('an error occurred, please try again later');

    }
  }
}