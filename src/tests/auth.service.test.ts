import AuthService from '../services/auth.service'
import UserService from '../services/user.service'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '../models'
import * as tokenBlacklist from '../helpers/tokenBlacklist'
import { InternalServerError } from '../Errors'
import { WinstonLogger } from '../helpers/Logger/WinstonLogger'

jest.mock('../services/user.service')
jest.mock('jsonwebtoken')
jest.mock('bcrypt')
jest.mock('../helpers/tokenBlacklist')

describe('AuthService', () => {
  let authService: AuthService
  let userService: UserService

  beforeEach(() => {
    userService = new UserService(new WinstonLogger())
    authService = new AuthService(userService, new WinstonLogger())
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const email = 'test@example.com'
      const password = 'password123'
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
        role: 'user',
      }

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user as User)
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          (
            data: string | Buffer,
            encrypted: string,
            callback: (err: Error | undefined, same: boolean) => any
          ) => {
            callback(undefined, true) // Simulate a successful comparison
          }
        )

      jest.spyOn(jwt, 'sign').mockReturnValue('token' as any)

      const result = await authService.login(email, password)

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email)
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password)
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'jwt_secret',
        { expiresIn: '7d' }
      )
      expect(result).toBe('token')
    })

    it('should throw an error if credentials are invalid', async () => {
      const email = 'test@example.com'
      const password = 'password123'

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null)

      await expect(authService.login(email, password)).rejects.toThrow(
        'Invalid credentials'
      )
    })

    it('should throw an error if the password is invalid', async () => {
      const email = 'test@example.com'
      const password = 'password123'
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
        role: 'user',
      }

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(user as User)
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          async (data: string | Buffer, encrypted: string) => {
            return true
          }
        )

      await expect(authService.login(email, password)).rejects.toThrow(
        'Invalid credentials'
      )
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const email = 'test@example.com'
      const password = 'password123'

      jest
        .spyOn(userService, 'getUserByEmail')
        .mockRejectedValue(new Error('Database error'))

      await expect(authService.login(email, password)).rejects.toThrow(
        InternalServerError
      )
    })
  })

  describe('register', () => {
    it('should create a new user and return it', async () => {
      const name = 'John Doe'
      const email = 'test@example.com'
      const password = 'password123'
      const hashedPassword = 'hashedPassword'
      const newUser = {
        name,
        email,
        password: hashedPassword,
        address: 'put address here',
        role: 'user',
      }
      const savedUser = { id: 1, ...newUser }

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null)
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => hashedPassword)

      jest.spyOn(userService, 'createUser').mockResolvedValue(savedUser as User)

      const result = await authService.register(name, email, password)

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email)
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10)
      expect(userService.createUser).toHaveBeenCalledWith(newUser)
      expect(result).toEqual(savedUser)
    })

    it('should throw an error if the user already exists', async () => {
      const email = 'test@example.com'

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValue({} as User)

      await expect(
        authService.register('John Doe', email, 'password123')
      ).rejects.toThrow('User already exists')
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const email = 'test@example.com'

      jest
        .spyOn(userService, 'getUserByEmail')
        .mockRejectedValue(new Error('Database error'))

      await expect(
        authService.register('John Doe', email, 'password123')
      ).rejects.toThrow(InternalServerError)
    })
  })

  describe('logout', () => {
    it('should add the token to the blacklist', async () => {
      const token = 'someToken'

      jest.spyOn(tokenBlacklist, 'addToBlacklist').mockImplementation(jest.fn())

      await authService.logout(token)

      expect(tokenBlacklist.addToBlacklist).toHaveBeenCalledWith(token)
    })

    it('should not add the token to the blacklist if it is already blacklisted', async () => {
      const token = 'someToken'

      jest.spyOn(tokenBlacklist, 'isTokenBlacklisted').mockReturnValue(true)

      await authService.logout(token)

      expect(tokenBlacklist.addToBlacklist).not.toHaveBeenCalled()
    })

    it('should throw an InternalServerError if an error occurs', async () => {
      const token = 'someToken'

      jest.spyOn(tokenBlacklist, 'addToBlacklist').mockImplementation(() => {
        throw new Error('Blacklist error')
      })

      await expect(authService.logout(token)).rejects.toThrow(
        InternalServerError
      )
    })
  })
})
