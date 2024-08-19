import { Model, ModelCtor, Sequelize } from 'sequelize-typescript'
import { IRepositoryBase } from './Interfaces/IRepositoryBase'

export class RepositoryBase<T extends Model> implements IRepositoryBase<T> {
  protected model: ModelCtor<T>

  constructor(model: ModelCtor<T>) {
    this.model = model
  }

  async findById(id: number): Promise<T | null> {
    return await this.model.findByPk<T>(id)
  }

  async findAll(): Promise<T[]> {
    return await this.model.findAll<T>()
  }

  async create(entity: T): Promise<T> {
    return await this.model.create(entity.dataValues, { returning: true })
  }

  async update(entity: T): Promise<T | null> {
    const [_, [updatedEntity]] = await this.model.update<T>(entity.dataValues, {
      where: { id: entity.id },
      returning: true,
    })
    return updatedEntity
  }

  async delete(id: number): Promise<boolean> {
    const T = await this.model.findByPk(id)
    if (T != null) {
      await T.destroy()
      return true
    }
    return false
  }
}
