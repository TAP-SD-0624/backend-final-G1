import { Response } from 'express'
import { AddressService } from '../services'
import { inject, injectable } from 'tsyringe'
import { updateAddressDTO } from '../Types/DTO'
import { ValidationError } from 'sequelize'
import { StatusCodes } from 'http-status-codes'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
import { AuthenticatedRequest } from '../helpers/AuthenticatedRequest'
import { InternalServerErrorResponse } from '../helpers/DefaultResponses/DefaultResponses'

@injectable()
export class AddressController {
  constructor(@inject(AddressService) private addressService: AddressService) {}

  public async get(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params
    try {
      const address = await this.addressService.getAddressByIdAndUserId(
        id as unknown as number,
        req.user?.id
      )
      if (!address) {
        return res.status(StatusCodes.NOT_FOUND).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Could not find the address with the specified Id',
        })
      }

      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        address,
      })
    } catch (error) {
      return InternalServerErrorResponse(res)
    }
  }

  public async getAll(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id
    try {
      const Addresses = await this.addressService.getAddressesByUserId(userId)
      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Addresses,
      })
    } catch (error) {
      return InternalServerErrorResponse(res)
    }
  }

  public async create(req: AuthenticatedRequest, res: Response) {
    console.log('hi')

    const userId = req.user?.id
    const addressData = req.body
    console.log('data: ', addressData)

    try {
      const Address = await this.addressService.createAddress(
        userId,
        addressData
      )
      return res.status(StatusCodes.CREATED).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Created Successfully',
        Address,
      })
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          ResponseCode: ResponseCodes.ValidationError,
          Message: 'Failed to create an address with the provided data',
        })
      }
      return InternalServerErrorResponse(res)
    }
  }

  public async update(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id
    const { id } = req.params
    const addressData = req.body as updateAddressDTO
    try {
      const Address = await this.addressService.updateAddress(
        id as unknown as number,
        userId,
        addressData
      )
      if (!Address) {
        return res.status(StatusCodes.NOT_FOUND).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Could not find an address with the provided Id',
        })
      }
      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Address,
      })
    } catch (error) {
      return InternalServerErrorResponse(res)
    }
  }

  public async delete(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id
    const { id } = req.params
    try {
      const Address = await this.addressService.deleteAddress(
        id as unknown as number,
        userId
      )
      if (!Address) {
        return res.status(StatusCodes.NOT_FOUND).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'Address not found',
        })
      }
      return res.status(StatusCodes.OK).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Success',
        Address,
      })
    } catch (error) {
      return InternalServerErrorResponse(res)
    }
  }
}
