import { IProductRepository } from "./Interfaces/IProductRepository";
import { Category, Discount, Product, ProductCategory, UserRating, } from "../models";
import { RepositoryBase } from "./RepositoryBase";

export class ProductRepository extends RepositoryBase<Product> implements IProductRepository {
    //create product aasociated with category
    async createProduct(productData: Product, categoryId: number): Promise<Product> {
        try {
            const product = await Product.create(productData, {
                include: [
                    {
                        model: Category, through: { attributes: [] }, where: { id: categoryId },
                    }
                ]
            });
            return product;
        } catch (error) {
            throw new Error(`Error while creating product`);
        }

    }
    // all find methods
    async findById(id: string): Promise<Product | null> {
        try {
            const product = await Product.findByPk(id, {
                include: [
                    { model: Category, through: { attributes: [] } },
                    { model: UserRating },
                    { model: Discount }

                ]
            });
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving product : ${error.message}`)
        }


    }
    async findByName(name: string): Promise<Product | null> {
        try {
            const product = await Product.findOne({
                where: { name },
                include: [
                    { model: Category, through: { attributes: [] } },
                    { model: UserRating },
                    { model: Discount }
                ]

            });
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving product : ${error.message}`)
        }

    }

    async findAll(): Promise<Product[]> {
        try {
            const product = await Product.findAll({
                include: [
                    { model: Category, through: { attributes: [] } },
                    { model: UserRating },
                    { model: Discount }
                ]
            });
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving products : ${error.message}`)
        }

    }
    async findByCategory(categoryId: number): Promise<Product[] | null> {
        try {
            const product = await Product.findAll({
                include: [
                    {
                        model: Category, through: { attributes: [] }, where: { id: categoryId }
                    },
                    { model: UserRating },
                    { model: Discount }




                ]
            });
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving product : ${error.message}`)
        }

    }
    async findAllByRating(ratingId: number): Promise<Product[] | null> {
        try {
            const product = await Product.findAll({
                include: [
                    { model: UserRating, where: { ratingId } },
                    { model: Category, through: { attributes: [] } },
                    { model: Discount }


                ]
            });
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving product : ${error.message}`)
        }

    }
    async findAllByDiscount(discountId: number): Promise<Product[] | number> {
        try {
            const product = await Product.findAll({
                include: [
                    {
                        model: Discount, where: { discountId }
                    },
                    { model: Category, through: { attributes: [] } },
                    { model: UserRating }
                ]
            });
            return product;
        } catch (error: any) {
            throw new Error(`Error retrieving product : ${error.message}`)
        }

    }
    /* 
    
    async findTopRatedProducts(): Promise<Product[]> {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: UserRating,
                        attributes: [] // Exclude UserRating fields from the result
                    }
                ],
                attributes: {
                    include: [
                        // Calculate the average rating and include it in the result
                        [sequelize.fn('AVG', sequelize.col('UserRatings.rating')), 'averageRating']
                    ]
                },
                group: ['Product.id'], // Group by product to calculate the average rating for each product
                order: [[sequelize.literal('averageRating'), 'DESC']], // Sort by average rating in descending order
                limit: 10 // Limit the number of top-rated products to return (optional)
            });
            return products;
        } catch (error: any) {
            // Provide detailed error information
            throw new Error(`Error retrieving top-rated products: ${error.message}`);
        }
    }
       */

}