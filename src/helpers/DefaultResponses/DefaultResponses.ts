import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseCodes } from '../../enums/ResponseCodesEnum'

export const InternalServerErrorResponse = (res: Response) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    Responsecode: ResponseCodes.InternalServerError,
    Message: 'Internal server error, please try again later.',
  })
}
