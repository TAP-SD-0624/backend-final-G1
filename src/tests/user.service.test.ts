import UserService from '../services/user.service'
import { userRepository } from '../data-access'
import { User } from '../models'
import { UserDTO } from '../Types/DTO/userDto'
import bcrypt from 'bcrypt'
import { WinstonLogger } from '../helpers/Logger/WinstonLogger'

jest.mock('../data-access/userRepository')
jest.mock('../models/User.model')
jest.mock('../helpers/Logger/WinstonLogger')
jest.mock('bcrypt')

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService(new WinstonLogger())
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    it('should create a user and return it', async () => {
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        address: '123 Main St',
        role: 'user',
      }
      const mockUser= {
        ...userData,
        password: 'hashedPassword', // Mocked hashed password
      }
      jest.spyOn(userRepository, 'create').mockResolvedValue(mockUser as User)

      const result = await userService.createUser(userData)

      expect(userRepository.create).toHaveBeenCalledWith(expect.any(User))
      expect(result).toEqual(mockUser as User)
    })

    it('should throw an error if user creation fails', async () => {
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        address: '123 Main St',
        role: 'user',
      }

      jest
        .spyOn(userRepository, 'create')
        .mockRejectedValue(new Error ("internal server error, please try again later"))

      await expect(userService.createUser(userData)).rejects.toThrow(
        'internal server error, please try again later'
      )
    })
  })

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      const userId = 1
      const mockUser = {
        name: 'John Doe',
        email: 'test@example.com',
      }
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser as User)

      const result = await userService.getUserById(userId)

      expect(userRepository.findById).toHaveBeenCalledWith(userId)
      expect(result).toEqual(mockUser as User)
    })

    it('should return null if user is not found', async () => {
      const userId = 1
      jest
        .spyOn(userRepository, 'findById')
        .mockRejectedValue( new Error())


      expect(userService.getUserById(userId)).toThrow("not found")
    })

    it('should throw an error if there is an issue retrieving the user', async () => {
      const userId = 1
      jest
        .spyOn(userRepository, 'findById')
        .mockRejectedValue(new Error('Database error'))

      await expect(userService.getUserById(userId)).rejects.toThrow(
        'internal server error, please try again later'
      )
    })
  })

  describe('getUserByEmail', () => {
    it('should return a user if found', async () => {
      const email = 'test@example.com'
      const mockUser= {
        name: 'John Doe',
        email: email,
      }
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue(mockUser as User)

      const result = await userService.getUserByEmail(email)

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(result).toEqual(mockUser as User)
    })

    it('should return null if user is not found', async () => {
      const email = 'test@example.com'
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockResolvedValue(null as unknown as User)

      const result = await userService.getUserByEmail(email)

      expect(result).toBeNull()
    })

    it('should throw an error if there is an issue retrieving the user by email', async () => {
      const email = 'test@example.com'
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockRejectedValue(new Error('Database error'))

      await expect(userService.getUserByEmail(email)).rejects.toThrow(
        'internal server error, please try again later'
      )
    })
  })

  describe('updateUser', () => {
    it('should update and return the updated user if data has changed', async () => {
      const userId = 1
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'newpassword123',
        address: '123 New St',
        role: 'admin',
      }
      const mockUser = {
        id: userId,
        ...userData,
      }
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser as User)
      jest
        .spyOn(userRepository, 'updateUser')
        .mockResolvedValue(mockUser as User)
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'password')

      const result = await userService.updateUser(userId, userData)

      expect(userRepository.findById).toHaveBeenCalledWith(userId)
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10)
      expect(userRepository.updateUser).toHaveBeenCalledWith(
        userId,
        expect.any(Object)
      )
      expect(result).toEqual(mockUser as User)
    })

    it('should throw an error if user is not found', async () => {
      const userId = 1
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'newpassword123',
        address: '123 New St',
        role: 'admin',
      }

      jest
        .spyOn(userRepository, 'findById')
        .mockRejectedValue(new Error())

      await expect(userService.updateUser(userId, userData)).rejects.toThrow(
        'User not found'
      )
    })

    it('should return the same user if no data has changed', async () => {
      const userId = 1
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        address: '123 Main St',
        role: 'user',
      }
      const mockUser= {
        id: userId,
        ...userData,
      }
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser as User)
      jest.spyOn(userService as any, 'isUserDataChanged').mockReturnValue(false)

      const result = await userService.updateUser(userId, userData)

      expect(result).toEqual(mockUser as User)
    })

    it('should throw an error if there is an issue updating the user', async () => {
      const userId = 1
      const userData: UserDTO = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'newpassword123',
        address: '123 New St',
        role: 'admin',
      }
      const mockUser= {
        id: userId,
        ...userData,
      }
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser as User)
      jest
        .spyOn(userRepository, 'updateUser')
        .mockRejectedValue(new Error('Database error'))

      await expect(userService.updateUser(userId, userData)).rejects.toThrow(
        'internal server error, please try again later'
      )
    })
  })

  describe('editUserPassword', () => {
    it('should update the user password and return a success message', async () => {
      const userId = 1
      const oldPassword = 'oldpassword'
      const newPassword = 'newpassword'
      const mockUser = {
        id: userId,
        password: 'hashedOldPassword',
      }
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser as User)
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          async (data: string | Buffer, encrypted: string) => {
            return true
          }
        )

      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => newPassword)
      jest.spyOn(User.prototype, 'save').mockResolvedValue(mockUser as User)
      jest.spyOn(User.prototype, 'set').mockImplementation((keys, options?)=>{
        return mockUser as User;
      })

      const result = await userService.editUserPassword(
        userId,
        oldPassword,
        newPassword
      )

      expect(bcrypt.compare).toHaveBeenCalledWith(
        oldPassword,
        'hashedOldPassword'
      )
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10)
      expect(User.prototype.save).toHaveBeenCalled()
      expect(result).toBe('Password updated successfully')
    })

    it('should throw an error if old password is incorrect', async () => {
      const userId = 1
      const oldPassword = 'oldpassword'
      const newPassword = 'newpassword'
      const mockUser = {
        id: userId,
        password: 'hashedOldPassword',
      }
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser as User)
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          async (data: string | Buffer, encrypted: string) => {
            return false
          }
        )

      await expect(
        userService.editUserPassword(userId, oldPassword, newPassword)
      ).rejects.toThrow('Old password is incorrect')
    })

    it('should throw an error if new password is the same as the old password', async () => {
      const userId = 1
      const oldPassword = 'oldpassword'
      const newPassword = 'oldpassword'
      const mockUser = {
        id: userId,
        password: 'hashedOldPassword',
      }
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser as User)
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          async (data: string | Buffer, encrypted: string) => {
            return true
          }
        )

      await expect(
        userService.editUserPassword(userId, oldPassword, newPassword)
      ).rejects.toThrow('New password must be different from the old password')
    })

    it('should throw an error if the hashed new password is the same as the old hashed password', async () => {
      const userId = 1
      const oldPassword = 'oldpassword'
      const newPassword = 'newpassword'
      const mockUser = {
        id: userId,
        password: 'hashedNewPassword',
      }
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser as User)
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          async (data: string | Buffer, encrypted: string) => {
            return true
          }
        )
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => newPassword)

      await expect(
        userService.editUserPassword(userId, oldPassword, newPassword)
      ).rejects.toThrow(
        'New password cannot be the same as the old password after hashing'
      )
    })
  })

  describe('deleteUser', () => {
    it('should delete the user', async () => {
      const userId = 1
      jest.spyOn(userRepository, 'deleteUser').mockResolvedValue(true)

      await expect(userService.deleteUser(userId)).resolves.toBeUndefined()
      expect(userRepository.deleteUser).toHaveBeenCalledWith(userId)
    })

    it('should throw an error if there is an issue deleting the user', async () => {
      const userId = 1
      jest
        .spyOn(userRepository, 'deleteUser')
        .mockRejectedValue(new Error('Database error'))

      await expect(userService.deleteUser(userId)).rejects.toThrow(
        'internal server error, please try again later'
      )
    })
  })

  describe('changeRole', () => {
    it('should change the user role and return the updated user', async () => {
      const userId = 1
      const role = 'admin'
      const mockUser = {
        id: userId,
        role: role,
      }
      jest
        .spyOn(userRepository, 'changeRole')
        .mockResolvedValue(mockUser as User)

      const result = await userService.changeRole(userId, role)

      expect(userRepository.changeRole).toHaveBeenCalledWith(userId, role)
      expect(result).toEqual(mockUser as User)
    })

    it('should throw an error if there is an issue changing the user role', async () => {
      const userId = 1
      const role = 'admin'
      jest
        .spyOn(userRepository, 'changeRole')
        .mockRejectedValue(new Error('Database error'))

      await expect(userService.changeRole(userId, role)).rejects.toThrow(
        'internal server error, please try again later'
      )
    })
  })
})
