import { ProductService } from "../services/product.service";
import { Product } from "../models"
import { ProductDTO } from '../DTO';
import { injectable, inject } from 'tsyringe';
import express, { Request, Response } from 'express';
@injectable()
class ProductController {


    constructor(@inject(ProductService) private productService: ProductService) { }

    public async createProduct(req: Request, res: Response): Promise<Product> {
        try {
            const newProduct: ProductDTO = req.body;
            const product = await this.productService.createProduct(newProduct);
            res.status(201).json(product);
            return product;
        } catch (error: any) {
            res.status(400).json({ error: error.message });
            throw error;
        }
    }



    public async updateProduct(req: Request, res: Response): Promise<Product> {
        try {
            const newProduct: ProductDTO = req.body;
            const productId = parseInt(req.params.id);
            const product = await this.productService.updateProduct(productId, newProduct);
            res.status(201).json(product);
            return product;
        } catch (error: any) {
            res.status(400).json({ error: error.message });
            throw error;
        }


    }

    public async daleteProduct(req: Request, res: Response): Promise<void> {
        try {
            const productId = parseInt(req.params.id);
            if (!productId) {
                throw new Error("Required Data is Unavailable");
            }
            await this.productService.deleteProduct(productId);
        } catch (error) {
            throw new Error(`Error deleting product: ${error}`);
        }

    }

    public async getALlProducts(req: Request, res: Response): Promise<Product[]> {
        try {
            const product = await this.productService.findAll();

            if (!product) {
                throw new Error("Failed to retrieve products");
            }
            return product;
        } catch (error) {
            throw new Error('Error retrieving products')
        }
    }

    public async getProductById(req: Request, res: Response): Promise<Product | null> {
        try {
            const productid = parseInt(req.params.id, 10);

            const product = await this.productService.findById(productid);
            if (!product) {
                throw new Error(`Product doesn't exist`);
            }
            return product;

        } catch (error) {
            throw new Error('Error retrieving product')
        }
    }

    public async getProductByName(req: Request, res: Response): Promise<Product | null> {
        const { name } = req.body;
        try {
            const product = await this.productService.findByName(name);
            if (!product) {
                throw new Error(`Product doesn't exist`);
            }
            return product;

        } catch (error) {
            throw new Error('Error retrieving product')
        }

    }

    public async getProductByCategory(req: Request, res: Response): Promise<Product[] | null> {
        const { categoryId } = req.body;
        try {

            const product = await this.productService.findByCategory(categoryId);
            if (!product) {
                throw new Error(`Product doesn't exist`);
            }
            return product;

        } catch (error) {
            throw new Error('Error retrieving product')
        }
    }

    public async getAllByRating(req: Request, res: Response): Promise<Product[] | null> {
        const { ratingId } = req.body;
        try {
            const product = await this.productService.findAllByRating(ratingId);
            if (!product) {
                throw new Error(`Product doesn't exist`);
            }
            return product;

        } catch (error) {
            throw new Error('Error retrieving product')
        }
    }

    public async getAllByDiscount(req: Request, res: Response): Promise<Product[] | null> {
        const { discountId } = req.body
        try {
            const product = await this.productService.findAllByDiscount(discountId);
            if (!product) {
                throw new Error(`Product doesn't exist`);
            }
            return product;

        } catch (error) {
            throw new Error('Error retrieving product')
        }
    }


}