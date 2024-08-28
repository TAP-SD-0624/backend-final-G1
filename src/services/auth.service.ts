import UserService from './user.service'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '../models'
import { injectable, inject } from 'tsyringe'
import { addToBlacklist, isTokenBlacklisted } from '../helpers/tokenBlacklist'
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from '../Errors/AuthenticationErrors'
import { InternalServerError } from '../Errors/InternalServerError'
import { ILogger } from '../helpers/Logger/ILogger'

@injectable()
export default class AuthService {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject('ILogger') private logger: ILogger
  ) {}

  public async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.userService.getUserByEmail(email)

      if (!user) {
        throw new InvalidCredentialsError('Invalid email or password')
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        throw new InvalidCredentialsError('Invalid email or password')
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret is not defined')
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      return token
    } catch (error: any) {
      this.logger.error(error)
      if (error instanceof InvalidCredentialsError) {
        throw error // Re-throw known errors
      }
      throw new InternalServerError('An error occurred during login')
    }
  }

  public async register(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    try {
      const existingUser = await this.userService.getUserByEmail(email)
      if (existingUser) {
        throw new UserAlreadyExistsError()
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = {
        name,
        email,
        password: hashedPassword,
        address: 'put address here',
        role: 'user',
      }
      return await this.userService.createUser(newUser)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }

  public async logout(token: string): Promise<void> {
    try {
      if (!isTokenBlacklisted(token)) {
        addToBlacklist(token)
      }
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }
}
