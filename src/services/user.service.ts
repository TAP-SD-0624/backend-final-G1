import { User } from "../models";
import { IUserRepository } from "../data-access/Interfaces/IUserRepository";
import { injectable } from "tsyringe";
import { UserDTO } from "../DTO/userDto";
import { UserRepository } from "../data-access/UserRepository";

@injectable()
export default class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(userData: UserDTO): Promise<User> {
    try {
      const newUser = new User();
      newUser.name = userData.name;
      newUser.email = userData.email;
      newUser.password = userData.password;
      newUser.address = userData.address;
      newUser.role = userData.role;
      const user = await this.userRepository.createUser(newUser);
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
      const user = await this.userRepository.findById(userId);
      return user;
    } catch (error) {
      throw new Error(`Error retrieving user: ${error}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      return user;
    } catch (error) {
      throw new Error(`Error retrieving user: ${error}`);
    }
  }

  async updateUser(userId: number, userData: UserDTO): Promise<User | null> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const newUser = new User();
      newUser.name = userData.name;
      newUser.email = userData.email;
      newUser.password = userData.password;
      newUser.address = userData.address;
      newUser.role = userData.role;

      const updatedUser = await this.userRepository.updateUser(userId, newUser);
      return updatedUser;
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await this.userRepository.deleteUser(userId);
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.findAll();
      return users;
    } catch (error) {
      throw new Error(`Error retrieving users: ${error}`);
    }
  }
}
