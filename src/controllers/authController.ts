import { Request, Response } from 'express'
import AuthService from '../services/auth.service'
import { inject, injectable } from 'tsyringe'
import { ResponseCodes } from '../enums/ResponseCodesEnum'

@injectable()
class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body
    try {
      const token = await this.authService.login(email, password)
      res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Login successful',
        token,
      })
    } catch (error: any) {
      res.status(401).json({
        ResponseCode: ResponseCodes.Unauthorized,
        Message: 'Invalid credentials',
      })
    }
  }

  async register(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body
    const name = `${firstName} ${lastName}`
    try {
      await this.authService.register(name, email, password)
      res.status(201).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'User created successfully',
      })
    } catch (error: any) {
      res.status(400).json({
        ResponseCode: ResponseCodes.BadRequest,
        Message: error.message,
      })
    }
  }

  async logout(req: Request, res: Response) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        ResponseCode: ResponseCodes.Unauthorized,
        Message: 'Authorization header missing',
      })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        ResponseCode: ResponseCodes.Unauthorized,
        Message: 'Token is missing from header',
      })
    }

    try {
      await this.authService.logout(token)
      res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Logged out successfully',
      })
    } catch (error: any) {
      res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'An error occurred while logging out',
      })
    }
  }
}

export default AuthController
