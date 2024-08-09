
import { Category, Product } from "../models";
import { ICategoryRepository } from "./Interfaces/ICategoryRepository";
import { RepositoryBase } from "./RepositoryBase";


export class CategoryRepository extends RepositoryBase<Category> implements ICategoryRepository {

    async createCategory(categoryData: Category): Promise<Category> {
        try {
            const category = await Category.create(categoryData);
            return category;
        } catch (error) {
            throw new Error('Error creating category')
        }


    }
    // all find methods
    async findById(id: string): Promise<Category | null> {
        try {
            const category = await Category.findByPk(id);
            return category;
        } catch (error) {
            throw new Error('Error retrieving category')
        }

    }
    async findAll(): Promise<Category[]> {
        try {
            const category = await Category.findAll();
            return category;
        }
        catch (error) {
            throw new Error('Error retrieving All Categories')
        }

    }
    async findByName(name: string): Promise<Category | null> {
        try {
            const category = await Category.findOne({
                where: { name }
            });
            return category;
        } catch (error) {
            throw new Error('Error retrieving Category')
        }

    }
    async findByProduct(productId: string): Promise<Category[] | null> {
        try {
            const category = await Category.findAll({
                include: [{ model: Product }, { through: { attributes: [] }, where: { productId } }],

            });
            return category;
        } catch (error) {
            throw new Error('Error retrieving Category')
        }

    }

}