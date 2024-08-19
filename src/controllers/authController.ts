import { Request, Response } from 'express'
import AuthService from '../services/auth.service'
import { inject, injectable } from 'tsyringe'
import { UserDTO } from '../Types/DTO'

@injectable()
class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) { }

  async login(req: Request, res: Response) {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    try {
      const token = await this.authService.login(email, password)
      res.status(200).json({ token })
    }catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  async register(req: Request, res: Response) {
    const { name, email, password, role, address }: UserDTO = req.body

    if (!name || !email || !password || !role || !address) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    try {
      await this.authService.register(name, email, address, password)
      res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
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
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
}

export default AuthController
