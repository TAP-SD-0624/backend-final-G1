import 'reflect-metadata'
import AddressService from '../services/address.service'
import { addressRepository } from '../data-access'
import { AddressDTO, updateAddressDTO } from '../Types/DTO'
import { InternalServerError } from '../Errors/InternalServerError'
import logger from '../helpers/logger'
import { Address } from '../models'
jest.mock('../data-access/addressRepository')
jest.mock('../helpers/logger')
jest.mock('../models/Address.model.ts', () => {
  return {
    Address: jest.fn().mockImplementation(() => {
      return {
        state: '',
        city: '',
        street: '',
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
      };
    }),
  };
});


describe('AddressService', () => {
  let addressService: AddressService

  beforeEach(() => {
    addressService = new AddressService()
    jest.clearAllMocks()
  })

  describe('getAddressByIdAndUserId', () => {
    it('should return the address if found P0', async () => {
      const id = 1
      const userId = 1
      const address: AddressDTO = {
        state: 'State',
        city: 'City',
        street: 'Street',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        mobileNumber: '1234567890',
      }

        ; (
          addressRepository.getAddressByIdAndUserId as jest.Mock
        ).mockResolvedValue(address)

      const result = await addressService.getAddressByIdAndUserId(id, userId)

      expect(addressRepository.getAddressByIdAndUserId).toHaveBeenCalledWith(
        id,
        userId
      )
      expect(result).toEqual(address)
    })

    it('should return null if the address is not found P1', async () => {
      const id = 1
      const userId = 1

        ; (
          addressRepository.getAddressByIdAndUserId as jest.Mock
        ).mockResolvedValue(null)

      const result = await addressService.getAddressByIdAndUserId(id, userId)

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const id = 1
      const userId = 1

        ; (
          addressRepository.getAddressByIdAndUserId as jest.Mock
        ).mockRejectedValue(new Error('Database error'))

      await expect(
        addressService.getAddressByIdAndUserId(id, userId)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('getAddressesByUserId', () => {
    it('should return a list of addresses for the user P0', async () => {
      const userId = 1
      const addresses: AddressDTO[] = [
        {
          state: 'State',
          city: 'City',
          street: 'Street',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          mobileNumber: '1234567890',
        },
      ]

        ; (addressRepository.getAddressesByUserId as jest.Mock).mockResolvedValue(
          addresses
        )

      const result = await addressService.getAddressesByUserId(userId)

      expect(addressRepository.getAddressesByUserId).toHaveBeenCalledWith(
        userId
      )
      expect(result).toEqual(addresses)
    })

    it('should return an empty array if no addresses are found P1', async () => {
      const userId = 1

        ; (addressRepository.getAddressesByUserId as jest.Mock).mockResolvedValue(
          []
        )

      const result = await addressService.getAddressesByUserId(userId)

      expect(result).toEqual([])
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const userId = 1

        ; (addressRepository.getAddressesByUserId as jest.Mock).mockRejectedValue(
          new Error('Database error')
        )

      await expect(addressService.getAddressesByUserId(userId)).rejects.toThrow(
        InternalServerError
      )
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('createAddress', () => {
    it('should create and return the address P0', async () => {
      const userId = 1
      const addressData: AddressDTO = {
        state: 'State',
        city: 'City',
        street: 'Street',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        mobileNumber: '1234567890',
      }

        ; (addressRepository.create as jest.Mock).mockResolvedValue(addressData)

      const result = await addressService.createAddress(userId, addressData)

      expect(result).toEqual(addressData)
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const userId = 1
      const addressData: AddressDTO = {
        state: 'State',
        city: 'City',
        street: 'Street',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        mobileNumber: '1234567890',
      }

        ; (addressRepository.create as jest.Mock).mockRejectedValue(
          new Error('Database error')
        )

      await expect(
        addressService.createAddress(userId, addressData)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('updateAddress', () => {
    it('should update and return the updated address P0', async () => {
      const id = 1
      const userId = 1
      const updateData: updateAddressDTO = {
        state: 'New State',
        city: 'New City',
      }
      const updatedAddress = {
        toJSON() {
          return {
            state: 'New State',
            city: 'New City',
            street: 'Street',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            mobileNumber: '1234567890',
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date(),
          }
        },
      }

      const updatedAddressResult: AddressDTO = {
        state: 'New State',
        city: 'New City',
        street: 'Street',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        mobileNumber: '1234567890',
      }

        ; (addressRepository.updateAddress as jest.Mock).mockResolvedValue(
          updatedAddress
        )

      const result = await addressService.updateAddress(id, userId, updateData)

      expect(addressRepository.updateAddress).toHaveBeenCalledWith(
        id,
        userId,
        updateData
      )
      expect(result).toEqual(updatedAddressResult)
    })

    it('should return null if the address is not found P1', async () => {
      const id = 1
      const userId = 1
      const updateData: updateAddressDTO = {
        state: 'New State',
        city: 'New City',
      }

        ; (addressRepository.updateAddress as jest.Mock).mockResolvedValue(null)

      const result = await addressService.updateAddress(id, userId, updateData)

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const id = 1
      const userId = 1
      const updateData: updateAddressDTO = {
        state: 'New State',
        city: 'New City',
      }
      const err = new Error('Database error')
        ; (addressRepository.updateAddress as jest.Mock).mockRejectedValue(err)

      await expect(
        addressService.updateAddress(id, userId, updateData)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalled()
    })
  })

  describe('deleteAddress', () => {
    it('should delete the address and return true P0', async () => {
      const id = 1
      const userId = 1

        ; (addressRepository.deleteAddress as jest.Mock).mockResolvedValue(true)

      const result = await addressService.deleteAddress(id, userId)

      expect(addressRepository.deleteAddress).toHaveBeenCalledWith(id, userId)
      expect(result).toBe(true)
    })

    it('should return false if the address is not found P1', async () => {
      const id = 1
      const userId = 1

        ; (addressRepository.deleteAddress as jest.Mock).mockResolvedValue(false)

      const result = await addressService.deleteAddress(id, userId)

      expect(result).toBe(false)
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const id = 1
      const userId = 1
      const err = new Error('Database error')
        ; (addressRepository.deleteAddress as jest.Mock).mockRejectedValue(err)

      await expect(
        addressService.deleteAddress(id, userId)
      ).rejects.toThrow(InternalServerError)
      expect(logger.error).toHaveBeenCalled()
    })
  })
})
