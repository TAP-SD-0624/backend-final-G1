import { CategoryRepository } from "../data-access/CategoryRepository"
import { injectable } from "tsyringe";
import { Category } from "../models";
import { CategoryDTO } from "../DTO";

@injectable()
export class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository
    }

    async createCategory(categoryData: CategoryDTO): Promise<Category> {
        try {
            const newCategory = new Category();
            newCategory.name = categoryData.name;
            const category = await this.categoryRepository.create(newCategory);

            if (!category) {
                throw new Error("Failed to create category  `");
            }
            return category;
        } catch (error) {
            throw new Error('Error creating category')
        }


    }

    async updateCategory(categoryId: number, categoryData: CategoryDTO): Promise<Category> {
        try {
            const oldCategory = await this.categoryRepository.findById(categoryId);
            if (!oldCategory) {
                throw new Error("Category Doesn't exist");
            }

            oldCategory.name = categoryData.name;
            const category = await this.categoryRepository.update(oldCategory);
            if (!category) {
                throw new Error("Failed to update category");
            }
            return category;
        } catch (error) {
            throw new Error(`Error while updating category`);
        }

    }

    // all find methods
    async findById(id: number): Promise<Category | null> {
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
    async findByProduct(productId: number): Promise<Category[] | null> {
        try {
            const category = await this.categoryRepository.findByProduct(productId);
            return category;
        } catch (error) {
            throw new Error('Error retrieving Category')
        }

    }

    async deleteCategory(CategoryId: number): Promise<boolean> {
        try {
            const deletedCategory = await this.categoryRepository.delete(CategoryId);

            return deletedCategory;

        } catch (error) {
            throw new Error(`Error while deleting category`);
        }

        return false;

    }



}