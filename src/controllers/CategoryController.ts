import { injectable, inject } from 'tsyringe'
import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { Category } from '../models';
import { CategoryDTO } from '../DTO';
@injectable()
class CategoryController {

    constructor(@inject(CategoryService) private categoryService: CategoryService) { }

    public async getAllCategories(req: Request, res: Response): Promise<Category[]> {
        try {
            const categories = await this.categoryService.findAll();
            if (!categories)
                throw new Error("No Categories Found");
            return categories;
        } catch (err) {
            throw new Error("Error occurred while retrieving categories");
        }

    }

    public async getCategoryByID(req: Request, res: Response): Promise<Category> {
        try {
            const categoryId = parseInt(req.params.id, 10);
            if (!categoryId) {
                throw new Error("No Id provided");
            }
            const category = await this.categoryService.findById(categoryId);
            if (!category) {
                throw new Error("Error while retrieving category");

            }
            return category;
        } catch (error) {
            throw new Error("Error occurred while retrieving category");
        }
    }

    public async createCategory(req: Request, res: Response): Promise<Category> {
        try {
            const category: CategoryDTO = req.body;
            if (!category) {
                throw new Error("No Data Provided");
            }
            const newCategory = await this.categoryService.createCategory(category);
            if (!newCategory) {
                throw new Error("Error while creating category");
            }
            return newCategory;

        } catch (error) {
            throw new Error("Error occurred while creating category");
        }

    }

    public async updateCategory(req: Request, res: Response): Promise<Category> {
        try {
            const newCategory: CategoryDTO = req.body;
            const categoryId = parseInt(req.params.id);
            if (!newCategory || !categoryId) {
                throw new Error("Required Data is unavailable")
            }
            const updatedCategory = await this.categoryService.updateCategory(categoryId, newCategory);
            if (!updatedCategory) {
                throw new Error("No category Found to be Updated")
            }
            return updatedCategory;



        }
        catch (err) {
            throw new Error("Error occurred while creating category");
        }
    }

    //delete controller
    public async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const deletedId = parseInt(req.params.id, 10);
            if (!deletedId) {
                throw new Error("Required Data is Unavailable");
            }
            await this.categoryService.deleteCategory(deletedId);
        } catch (error) {
            throw new Error(`Error deleting Category: ${error}`);
        }
    }



    //findByName
    public async findByName(req: Request, res: Response): Promise<Category | null> {
        try {
            const { name } = req.body;
            if (!name) {
                throw new Error("No name provided");
            }
            const category = await this.categoryService.findByName(name);
            if (!category) {
                throw new Error("No Category related to this product")
            }
            return category;
        } catch (error) {
            throw new Error('Error retrieving Category')
        }

    }

    //findByProduct

    public async findByProduct(req: Request, res: Response): Promise<Category[] | null> {
        try {
            const productId = parseInt(req.params.id, 10);
            if (!productId) {
                throw new Error('No Product assigned');
            }

            const category = await this.categoryService.findByProduct(productId);

            if (!category) {
                throw new Error("No Categories Found");
            }
            return category;
        } catch (error) {
            throw new Error('Error retrieving Category')
        }

    }


}