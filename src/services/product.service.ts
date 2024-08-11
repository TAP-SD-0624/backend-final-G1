import { injectable } from "tsyringe";
import { ProductRepository } from "../data-access/ProductRepository";
import { Product } from "../models";
import { ProductDTO } from "../DTO";

@injectable()
export class ProductService {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async createProduct(productData: ProductDTO): Promise<Product> {
        try {
            const newProduct = new Product();
            newProduct.name = productData.name;
            newProduct.price = productData.price;
            newProduct.stock = productData.stock;
            newProduct.brand = productData.brand;
            newProduct.description = productData.description;
            const product = await this.productRepository.create(newProduct);
            if (!product) {
                throw new Error("Failed to create product");
            }
            return product;
        } catch (error) {
            throw new Error(`Error while creating product`);
        }

    }

    async updateProduct(productId: number, productData: ProductDTO): Promise<Product> {
        try {
            const oldProduct = await this.productRepository.findById(productId);
            if (!oldProduct) {
                throw new Error("Product Doesn't exist");
            }

            oldProduct.name = productData.name;
            oldProduct.price = productData.price;
            oldProduct.stock = productData.stock;
            oldProduct.brand = productData.brand;
            oldProduct.description = productData.description;
            const product = await this.productRepository.update(oldProduct);
            if (!product) {
                throw new Error("Failed to update product");
            }
            return product;
        } catch (error) {
            throw new Error(`Error while updating product`);
        }

    }

    async deleteProduct(productId: number): Promise<boolean> {
        try {
            const deletedProduct = await this.productRepository.delete(productId);

            return deletedProduct;

        } catch (error) {
            throw new Error(`Error while deleting product`);
        }

        return false;

    }
    async findById(id: number): Promise<Product | null> {
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
    async findAllByDiscount(discountId: number): Promise<Product[] | null> {
        try {
            const product = await this.findAllByDiscount(discountId);
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving product : ${error.message}`)
        }

    }
}
