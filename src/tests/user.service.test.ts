import 'reflect-metadata'
import UserService from '../services/user.service'
import { userRepository } from '../data-access'
import { UserDTO } from '../Types/DTO/userDto'
import { InternalServerError, BadRequestError } from '../Errors'
import { ILogger } from '../helpers/Logger/ILogger'
import { WinstonLogger } from '../helpers/Logger/WinstonLogger'
import bcrypt from 'bcrypt'
import { User } from '../models'

jest.mock('../data-access/userRepository')
jest.mock('../helpers/Logger/WinstonLogger')
jest.mock('../models/User.model.ts', () => {
  return {
    User: jest.fn().mockImplementation(() => {
      return {
        name: '',
        email: '',
        password: '',
        address: '',
        role: '',
        set: jest.fn(),
        save: jest.fn(),
      }
    }),
  }
})

describe('UserService', () => {
  let userService: UserService
  let mockLogger: ILogger

  beforeEach(() => {
    mockLogger = new WinstonLogger()
    userService = new UserService(mockLogger)
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    it('should create and return a user P0', async () => {
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        address: '123 Main St',
        role: 'user',
      }

      const newUser = new User()
      newUser.name = userData.name
      newUser.email = userData.email
      newUser.password = userData.password
      newUser.address = userData.address
      newUser.role = userData.role
      ;(userRepository.create as jest.Mock).mockResolvedValue(newUser)

      const result = await userService.createUser(userData)

      expect(result).toEqual(newUser)
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        address: '123 Main St',
        role: 'user',
      }

      ;(userRepository.create as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(userService.createUser(userData)).rejects.toThrow(
        InternalServerError
      )
    })
  })

  describe('getUserById', () => {
    it('should return the user if found P0', async () => {
      const userId = 1
      const user = new User()

      ;(userRepository.findById as jest.Mock).mockResolvedValue(user)

      const result = await userService.getUserById(userId)

      expect(userRepository.findById).toHaveBeenCalledWith(userId)
      expect(result).toEqual(user)
    })

    it('should return null if the user is not found P1', async () => {
      const userId = 1

      ;(userRepository.findById as jest.Mock).mockResolvedValue(null)

      const result = await userService.getUserById(userId)

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const userId = 1

      ;(userRepository.findById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(userService.getUserById(userId)).rejects.toThrow(
        InternalServerError
      )
    })
  })

  describe('getUserByEmail', () => {
    it('should return the user if found P0', async () => {
      const email = 'john.doe@example.com'
      const user = new User()

      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(user)

      const result = await userService.getUserByEmail(email)

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(result).toEqual(user)
    })

    it('should return null if the user is not found P1', async () => {
      const email = 'john.doe@example.com'

      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(null)

      const result = await userService.getUserByEmail(email)

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const email = 'john.doe@example.com'

      ;(userRepository.findByEmail as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(userService.getUserByEmail(email)).rejects.toThrow(
        InternalServerError
      )
    })
  })

  describe('updateUser', () => {
    it('should update and return the updated user P0', async () => {
      const userId = 1
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'newpassword123',
        address: '123 Main St',
        role: 'user',
      }
      const existingUser = new User()
      existingUser.password = 'oldpassword123'

      const updatedUser = new User()
      updatedUser.name = userData.name
      updatedUser.email = userData.email
      updatedUser.password = await bcrypt.hash(userData.password, 10)
      updatedUser.address = userData.address
      updatedUser.role = userData.role
      ;(userRepository.findById as jest.Mock).mockResolvedValue(existingUser)
      ;(userRepository.updateUser as jest.Mock).mockResolvedValue(updatedUser)

      const result = await userService.updateUser(userId, userData)

      expect(userRepository.findById).toHaveBeenCalledWith(userId)
      expect(userRepository.updateUser).toHaveBeenCalledWith(
        userId,
        expect.any(Object)
      )
      expect(result).toEqual(updatedUser)
    })

    it('should return null if the user is not found P1', async () => {
      const userId = 1
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'newpassword123',
        address: '123 Main St',
        role: 'user',
      }

      ;(userRepository.findById as jest.Mock).mockResolvedValue(null)

      const result = await userService.updateUser(userId, userData)

      expect(result).toBeNull()
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const userId = 1
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'newpassword123',
        address: '123 Main St',
        role: 'user',
      }

      ;(userRepository.findById as jest.Mock).mockResolvedValue(new User())
      ;(userRepository.updateUser as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(userService.updateUser(userId, userData)).rejects.toThrow(
        InternalServerError
      )
    })
  })

  describe('editUserPassword', () => {
    it('should change the user password P0', async () => {
      const userId = 1
      const oldPassword = 'oldpassword123'
      const newPassword = 'newpassword123'
      const user = new User()
      user.password = await bcrypt.hash(oldPassword, 10)
      ;(userRepository.findById as jest.Mock).mockResolvedValue(user)
      ;(user.save as jest.Mock).mockResolvedValue(user)

      await userService.editUserPassword(userId, oldPassword, newPassword)

      expect(userRepository.findById).toHaveBeenCalledWith(userId)
      expect(user.set).toHaveBeenCalledWith('password', expect.any(String))
      expect(user.save).toHaveBeenCalled()
    })

    it('should throw BadRequestError if the old password is incorrect P1', async () => {
      const userId = 1
      const oldPassword = 'wrongpassword'
      const newPassword = 'newpassword123'
      const user = new User()
      user.password = await bcrypt.hash('correctpassword', 10)
      ;(userRepository.findById as jest.Mock).mockResolvedValue(user)

      await expect(
        userService.editUserPassword(userId, oldPassword, newPassword)
      ).rejects.toThrow(BadRequestError)
    })

    it('should throw BadRequestError if the new password is the same as the old password P1', async () => {
      const userId = 1
      const oldPassword = 'oldpassword123'
      const newPassword = 'oldpassword123'
      const user = new User()
      user.password = await bcrypt.hash(oldPassword, 10)
      ;(userRepository.findById as jest.Mock).mockResolvedValue(user)

      await expect(
        userService.editUserPassword(userId, oldPassword, newPassword)
      ).rejects.toThrow(BadRequestError)
    })

    it('should throw an InternalServerError if an error occurs P1', async () => {
      const userId = 1
      const oldPassword = 'oldpassword123'
      const newPassword = 'newpassword123'

      ;(userRepository.findById as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(
        userService.editUserPassword(userId, oldPassword, newPassword)
      ).rejects.toThrow(InternalServerError)
    })
  })
})
