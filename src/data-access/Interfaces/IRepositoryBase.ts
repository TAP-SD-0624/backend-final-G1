export interface IRepositoryBase<T> {
  findById(id: number): Promise<T | null>
  findAll(): Promise<T[]>
  create(entity: T): Promise<T | null>
  update(entity: T): Promise<T | null>
  delete(id: number): Promise<boolean>
}
