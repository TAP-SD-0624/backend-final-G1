import { User } from "../models";
import { IUserRepository } from "./Interfaces/IUserRepository";
import { RepositoryBase } from "./RepositoryBase";

export class UserRepository
  extends RepositoryBase<User>
  implements IUserRepository
{
  async createUser(userData: User): Promise<User> {
    try {
      return await this.model.create(userData.dataValues);
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.model.findOne({ where: { email } });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error}`);
    }
  }

  async findByRole(role: string): Promise<User[]> {
    try {
      return await this.model.findAll({ where: { role } });
    } catch (error) {
      throw new Error(`Error finding users by role: ${error}`);
    }
  }

  async findByAddress(address: string): Promise<User[]> {
    try {
      return await this.model.findAll({ where: { address } });
    } catch (error) {
      throw new Error(`Error finding users by address: ${error}`);
    }
  }

  async findByRoleAndAddress(role: string, address: string): Promise<User[]> {
    try {
      return await this.model.findAll({ where: { role, address } });
    } catch (error) {
      throw new Error(`Error finding users by role and address: ${error}`);
    }
  }

  async findByRoleAndEmail(role: string, email: string): Promise<User[]> {
    try {
      return await this.model.findAll({ where: { role, email } });
    } catch (error) {
      throw new Error(`Error finding users by role and email: ${error}`);
    }
  }

  async updateUser(id: number, userData: User): Promise<User | null> {
    try {
      const [affectedRows, [updatedUser]] = await this.model.update(userData, {
        where: { id },
        returning: true,
      });
      return affectedRows > 0 ? updatedUser : null;
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const deletedRows = await this.model.destroy({ where: { id } });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }
}
