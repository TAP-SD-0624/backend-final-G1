import { injectable } from "tsyringe";
import { ProductRepository } from "../data-access/ProductRepository";
import { Product } from "../models";

@injectable()
export class ProductService {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async createProduct(productData: Product, categoryId: number): Promise<Product> {
        try {
            const product = await this.productRepository.createProduct(productData, categoryId);
            return product;
        } catch (error) {
            throw new Error(`Error while creating product`);
        }

    }

    async findById(id: string): Promise<Product | null> {
        try {
            const product = await this.productRepository.findById(id);
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving product : ${error.message}`)
        }


    }
    async findByName(name: string): Promise<Product | null> {
        try {
            const product = await this.productRepository.findByName(name);
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving product : ${error.message}`)
        }

    }

    async findAll(): Promise<Product[]> {
        try {
            const product = await this.productRepository.findAll();
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving products : ${error.message}`)
        }

    }
    async findByCategory(categoryId: number): Promise<Product[] | null> {
        try {
            const product = await this.productRepository.findByCategory(categoryId);
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving product : ${error.message}`)
        }

    }
    async findAllByRating(ratingId: number): Promise<Product[] | null> {
        try {
            const product = await this.findAllByRating(ratingId);
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving product : ${error.message}`)
        }

    }
    async findAllByDiscount(discountId: number): Promise<Product[] | number> {
        try {
            const product = await this.findAllByDiscount(discountId);
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving product : ${error.message}`)
        }

    }
}
