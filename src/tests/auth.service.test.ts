import 'reflect-metadata'
import AuthService from '../services/auth.service'
import { User } from '../models'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from '../Errors/AuthenticationErrors'
import { InternalServerError } from '../Errors/InternalServerError'
import { ILogger } from '../helpers/Logger/ILogger'
import { userRepository } from '../data-access'
import { addToBlacklist, isTokenBlacklisted } from '../helpers/tokenBlacklist'
import UserService from '../services/user.service'

jest.mock('jsonwebtoken')
jest.mock('bcrypt')
jest.mock('../data-access/userRepository')
jest.mock('../helpers/tokenBlacklist')
jest.mock('../services/user.service')
jest.mock('../helpers/Logger/WinstonLogger')

describe('AuthService', () => {
  let authService: AuthService
  let mockLogger: ILogger
  let mockUserService: UserService

  beforeEach(() => {
    mockLogger = { error: jest.fn() } as unknown as ILogger
    mockUserService = { createUser: jest.fn() } as unknown as UserService
    authService = new AuthService(mockUserService, mockLogger)
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should return a JWT token if credentials are valid P0', async () => {
      const email = 'john.doe@example.com'
      const password = 'password123'
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = { id: 1, role: 'user', password: hashedPassword } as User
      const secret = 'testsecret'
      const token = 'jsonwebtoken.token'

      process.env.JWT_SECRET = secret
      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(user)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(jwt.sign as jest.Mock).mockReturnValue(token)

      const result = await authService.login(email, password)

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword)
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user.id, role: user.role },
        secret,
        { expiresIn: '7d' }
      )
      expect(result).toEqual(token)
    })

    it('should throw InvalidCredentialsError if user is not found P1', async () => {
      const email = 'john.doe@example.com'
      const password = 'password123'

      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(null)

      await expect(authService.login(email, password)).rejects.toThrow(
        InvalidCredentialsError
      )
    })

    it('should throw InvalidCredentialsError if password is incorrect P1', async () => {
      const email = 'john.doe@example.com'
      const password = 'wrongpassword'
      const hashedPassword = await bcrypt.hash('password123', 10)
      const user = { id: 1, role: 'user', password: hashedPassword } as User

      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(user)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(authService.login(email, password)).rejects.toThrow(
        InvalidCredentialsError
      )
    })

    it('should throw InternalServerError if JWT secret is not defined P1', async () => {
      const email = 'john.doe@example.com'
      const password = 'password123'
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = { id: 1, role: 'user', password: hashedPassword } as User

      delete process.env.JWT_SECRET
      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(user)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      await expect(authService.login(email, password)).rejects.toThrow(
        InternalServerError
      )
    })

    it('should log error and throw InternalServerError on unexpected errors P1', async () => {
      const email = 'john.doe@example.com'
      const password = 'password123'

      ;(userRepository.findByEmail as jest.Mock).mockRejectedValue(
        new Error('Unexpected error')
      )

      await expect(authService.login(email, password)).rejects.toThrow(
        InternalServerError
      )
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })

  describe('register', () => {
    it('should register a new user and return the user P0', async () => {
      const name = 'John Doe'
      const email = 'john.doe@example.com'
      const password = 'password123'
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = {
        id: 1,
        name,
        email,
        password: hashedPassword,
        address: 'put address here',
        role: 'user',
      } as User

      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)
      ;(mockUserService.createUser as jest.Mock).mockResolvedValue(newUser)

      const result = await authService.register(name, email, password)

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10)
      expect(mockUserService.createUser).toHaveBeenCalledWith({
        name,
        email,
        password: hashedPassword,
        address: 'put address here',
        role: 'user',
      })
      expect(result).toEqual(newUser)
    })

    it('should throw UserAlreadyExistsError if the user already exists P1', async () => {
      const name = 'John Doe'
      const email = 'john.doe@example.com'
      const password = 'password123'

      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue({} as User)

      await expect(authService.register(name, email, password)).rejects.toThrow(
        UserAlreadyExistsError
      )
    })

    it('should log error and throw InternalServerError on unexpected errors P1', async () => {
      const name = 'John Doe'
      const email = 'john.doe@example.com'
      const password = 'password123'

      ;(userRepository.findByEmail as jest.Mock).mockRejectedValue(
        new Error('Unexpected error')
      )

      await expect(authService.register(name, email, password)).rejects.toThrow(
        InternalServerError
      )
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    it('should add token to blacklist P0', async () => {
      const token = 'some.jwt.token'

      ;(isTokenBlacklisted as jest.Mock).mockReturnValue(false)
      ;(addToBlacklist as jest.Mock).mockImplementation(() => {})

      await authService.logout(token)

      expect(isTokenBlacklisted).toHaveBeenCalledWith(token)
      expect(addToBlacklist).toHaveBeenCalledWith(token)
    })

    it('should not add token to blacklist if it is already blacklisted P1', async () => {
      const token = 'some.jwt.token'

      ;(isTokenBlacklisted as jest.Mock).mockReturnValue(true)

      await authService.logout(token)

      expect(isTokenBlacklisted).toHaveBeenCalledWith(token)
      expect(addToBlacklist).not.toHaveBeenCalled()
    })

    it('should log error and throw InternalServerError on unexpected errors P1', async () => {
      const token = 'some.jwt.token'

      ;(isTokenBlacklisted as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      await expect(authService.logout(token)).rejects.toThrow(
        InternalServerError
      )
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })
})
