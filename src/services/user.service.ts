import { User } from '../models'
import { userRepository } from '../data-access'
import { UserDTO } from '../Types/DTO/userDto'
import bcrypt from 'bcrypt'
import { InternalServerError, NotFoundError, BadRequestError, ValidationError } from '../Errors'
import { ILogger } from '../helpers/Logger/ILogger'
import { inject, injectable } from 'tsyringe'
import { ValidationError as VE } from 'sequelize'

@injectable()
export default class UserService {
  constructor(@inject('ILogger') private logger: ILogger) { }

  async createUser(userData: UserDTO): Promise<User> {
    try {
      const newUser = new User()
      newUser.name = userData.name
      newUser.email = userData.email
      newUser.password = userData.password
      newUser.address = userData.address
      newUser.role = userData.role

      const user = await userRepository.create(newUser)

      return user
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof VE) {
        throw new ValidationError(error.message)
      }
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  async getUserById(userId: number): Promise<User | null> {
    try {
      return await userRepository.findById(userId)
    } catch (error: unknown) {
      console.log(error)
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await userRepository.findByEmail(email)
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await userRepository.findAll()
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  async updateUser(userId: number, userData: UserDTO): Promise<User | null> {
    try {
      const user = await userRepository.findById(userId)
      if (!user) {
        return null
      }

      const isDataChanged = this.isUserDataChanged(user, userData)
      if (!isDataChanged) {
        return user
      }

      // Only hash the password if it has changed
      const partialUser: Partial<User> = {
        name: userData.name,
        email: userData.email,
        password: userData.password
          ? await bcrypt.hash(userData.password, 10)
          : user.password,
        address: userData.address,
        role: userData.role,
      }

      return await userRepository.updateUser(userId, partialUser)
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  // Helper function to check if data has changed, excluding password
  private isUserDataChanged(existingUser: User, newUserData: UserDTO): boolean {
    return (
      existingUser.name !== newUserData.name ||
      existingUser.email !== newUserData.email ||
      (newUserData.password &&
        !bcrypt.compareSync(newUserData.password, existingUser.password)) ||
      existingUser.address !== newUserData.address ||
      existingUser.role !== newUserData.role
    )
  }

  // Edit the user password
  async editUserPassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      const user = await userRepository.findById(userId)
      if (!user) {
        return null
      }

      const isOldPasswordMatch = await bcrypt.compare(
        oldPassword,
        user.password
      )
      if (!isOldPasswordMatch) {
        throw new BadRequestError('Old password is incorrect')
      }

      if (oldPassword === newPassword) {
        throw new BadRequestError(
          'New password must be different from the old password'
        )
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10)

      user.set('password', hashedNewPassword)
      await user.save()
    } catch (error: unknown) {
      if (error instanceof BadRequestError) {
        throw error
      }
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  async deleteUser(userId: number) {
    try {
      return await userRepository.deleteUser(userId)
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  // Function to change the role of a user
  async changeRole(userId: number, role: string): Promise<User | null> {
    try {
      return await userRepository.changeRole(userId, role)
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }

  async getUser(id: number): Promise<User | null> {
    try {
      return await userRepository.findOne({ where: { id } })
    } catch (error: unknown) {
      this.logger.error(error as Error)
      throw new InternalServerError()
    }
  }
}
