import { User } from "../models";
import { userRepository } from "../data-access";
import { UserDTO } from "../DTO/userDto";

export default class UserService {
  async createUser(userData: UserDTO): Promise<User> {
    try {
      const newUser = new User();
      newUser.name = userData.name;
      newUser.email = userData.email;
      newUser.password = userData.password;
      newUser.address = userData.address;
      newUser.role = userData.role;

      const user = await userRepository.createUser(newUser);
      if (!user) {
        throw new Error("Failed to create user");
      }
      return user;
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getUserById(userId: number): Promise<User | null> {
    try {
      const user = await userRepository.findById(userId);
      return user;
    } catch (error) {
      throw new Error(`Error retrieving user: ${error}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await userRepository.findByEmail(email);
      return user;
    } catch (error) {
      throw new Error(`Error retrieving user: ${error}`);
    }
  }

  async updateUser(userId: number, userData: UserDTO): Promise<User | null> {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const newUser = new User();
      newUser.name = userData.name;
      newUser.email = userData.email;
      newUser.password = userData.password;
      newUser.address = userData.address;
      newUser.role = userData.role;

      const updatedUser = await userRepository.updateUser(userId, newUser);
      return updatedUser;
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await userRepository.deleteUser(userId);
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await userRepository.findAll();
      return users;
    } catch (error) {
      throw new Error(`Error retrieving users: ${error}`);
    }
  }
}
