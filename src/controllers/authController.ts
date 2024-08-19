import { Request, Response } from 'express'
import AuthService from '../services/auth.service'
import { inject, injectable } from 'tsyringe'
import { UserDTO } from '../Types/DTO'

@injectable()
class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    try {
      const token = await this.authService.login(email, password)
      res.status(200).json({ token })
    } catch (error: any) {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  }

  async register(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body

    const name = `${firstName} ${lastName}`

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    try {
      await this.authService.register(name, email, password)
      res.status(201).json({ message: 'User created successfully' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async logout(req: Request, res: Response) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Token is missing from header' })
    }

    try {
      await this.authService.logout(token)
      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error: any) {
      res.status(500).json({ error: 'An error occurred while logging out' })
    }
  }
}

export default AuthController
