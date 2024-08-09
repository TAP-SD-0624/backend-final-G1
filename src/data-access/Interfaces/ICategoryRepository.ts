import { Category } from "../../models";
import { IRepositoryBase } from "./IRepositoryBase";

export interface ICategoryRepository extends IRepositoryBase<Category> {
    
    createCategory(categoryData: Category): Promise<Category> 
     // all find methods
    findById(id: string): Promise<Category | null>
    findAll(): Promise<Category[]>
    findByName(name: string): Promise<Category | null>
    findByProduct(productId: string): Promise<Category[] | null>
}