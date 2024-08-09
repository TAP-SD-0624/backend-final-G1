import { CategoryRepository } from "../data-access/CategoryRepository"
import { injectable } from "tsyringe";
import { Category } from "../models";

@injectable()
export class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository
    }

    async createCategory(categoryData: Category): Promise<Category> {
        try {
            const category = await this.categoryRepository.createCategory(categoryData);
            return category;
        } catch (error) {
            throw new Error('Error creating category')
        }


    }
    // all find methods
    async findById(id: string): Promise<Category | null> {
        try {
            const category = await this.categoryRepository.findById(id);
            return category;
        } catch (error) {
            throw new Error('Error retrieving category')
        }

    }
    async findAll(): Promise<Category[]> {
        try {
            const category = await this.categoryRepository.findAll();;
            return category;
        }
        catch (error) {
            throw new Error('Error retrieving All Categories')
        }

    }
    async findByName(name: string): Promise<Category | null> {
        try {
            const category = await this.categoryRepository.findByName(name);
            return category;
        } catch (error) {
            throw new Error('Error retrieving Category')
        }

    }
    async findByProduct(productId: string): Promise<Category[] | null> {
        try {
            const category = await this.categoryRepository.findByProduct(productId);
            return category;
        } catch (error) {
            throw new Error('Error retrieving Category')
        }

    }



}