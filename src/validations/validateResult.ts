import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
export function validateResult(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      ResponseCode: ResponseCodes.ValidationError,
      Meesage: 'Failed at one of the required validations',
      errors: errors.array(),
    })
    return
  }
  next()
}
