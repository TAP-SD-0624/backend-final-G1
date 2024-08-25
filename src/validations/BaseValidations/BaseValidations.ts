import { query } from 'express-validator'
import { IsFloatOptions, IsIntOptions } from 'express-validator/lib/options'

export const RequiredIntQuery = (name: string, IsIntOptions?: IsIntOptions) => {
  return RequiredQuery(name).isInt(IsIntOptions)
}

export const IntQuery = (name: string, IsIntOptions?: IsIntOptions) => {
  return query(name)
    .isInt(IsIntOptions)
    .withMessage(`${name} value should be int and more than 0`)
    .toInt()
}

export const RequiredQuery = (name: string) => {
  return query(name).notEmpty().withMessage(`${name} field is required.`)
}

export const FloatQuery = (name: string, isFloatOptions?: IsFloatOptions) => {
  return query(name).optional().isFloat(isFloatOptions).toFloat()
}

export const StringQuery = (name: string) => {
  return query(name)
    .isString()
    .withMessage(`${name} should be a string`)
    .toString()
}
