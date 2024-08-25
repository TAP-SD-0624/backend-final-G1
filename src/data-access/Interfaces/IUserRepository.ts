import { User } from '../../models'
import { IRepositoryBase } from './IRepositoryBase'

export interface IUserRepository extends IRepositoryBase<User> {
  findByEmail(email: string): Promise<User | null>
  findByRole(role: string): Promise<User[]>
  findByAddress(address: string): Promise<User[]>
  findByRoleAndAddress(role: string, address: string): Promise<User[]>
  findByRoleAndEmail(role: string, email: string): Promise<User[]>
  updateUser(id: number, userData: User): Promise<User | null>
  deleteUser(id: number): Promise<boolean>
}
