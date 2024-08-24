import { User } from '../models'
import { userRepository } from '../data-access'
import { UserDTO } from '../Types/DTO/userDto'
import bcrypt from 'bcrypt'

export default class UserService {
  async createUser(userData: UserDTO): Promise<User> {
    try {
      const newUser = new User()
      newUser.name = userData.name
      newUser.email = userData.email
      newUser.password = userData.password
      newUser.address = userData.address
      newUser.role = userData.role

      const user = await userRepository.create(newUser)
      if (!user) {
        throw new Error('Failed to create user')
      }
      return user
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`)
    }
  }

  async getUserById(userId: number): Promise<User | null> {
    try {
      const user = await userRepository.findById(userId)
      return user
    } catch (error) {
      throw new Error(`Error retrieving user: ${error}`)
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await userRepository.findByEmail(email)
      if (!user) {
        console.warn(`No user found with email: ${email}`)
      }
      return user
    } catch (error: any) {
      console.error(`Error retrieving user by email: ${email}`, error)
      throw new Error(`Error retrieving user: ${error.message}`)
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await userRepository.findAll()
      return users
    } catch (error) {
      throw new Error(`Error retrieving users: ${error}`)
    }
  }

  async updateUser(userId: number, userData: UserDTO): Promise<User | null> {
    try {
      const user = await userRepository.findById(userId)
      if (!user) {
        throw new Error('User not found')
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

      const updatedUser = await userRepository.updateUser(userId, partialUser)
      return updatedUser
    } catch (error: any) {
      throw new Error(`Error updating user: ${error.message}`)
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
  ): Promise<string> {
    try {
      const user = await userRepository.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      const isOldPasswordMatch = await bcrypt.compare(
        oldPassword,
        user.password
      )
      if (!isOldPasswordMatch) {
        throw new Error('Old password is incorrect')
      }

      if (oldPassword === newPassword) {
        throw new Error('New password must be different from the old password')
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10)

      // Check if the new hashed password is actually different
      if (user.password === hashedNewPassword) {
        throw new Error(
          'New password cannot be the same as the old password after hashing'
        )
      }

      user.set('password', hashedNewPassword)
      await user.save()
      return 'Password updated successfully'
    } catch (error: any) {
      throw new Error(`Error editing user password: ${error.message}`)
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await userRepository.deleteUser(userId)
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`)
    }
  }

  // Function to change the role of a user
  async changeRole(userId: number, role: string): Promise<User | null> {
    try {
      return await userRepository.changeRole(userId, role)
    } catch (error: any) {
      throw new Error(`Error changing user role: ${error.message}`)
    }
  }
  async getUser(id: number): Promise<User> {
    const user = await userRepository.findOne({ where: { id } })
    if (!user) {
      throw new Error(`User not found with id: ${id}`)
    }
    return user
  }
}
