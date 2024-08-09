import { Product } from "../../models";
import { IRepositoryBase } from "./IRepositoryBase";

export interface IProductRepository extends IRepositoryBase<Product> {

    //create product aasociated with category
    createProduct(productData: Product, categoryId: number): Promise<Product>
    // all find methods
    findById(id: string): Promise<Product | null>
    findByName(name: string): Promise<Product | null>
    findAll(): Promise<Product[]>
    findByCategory(categoryId: number): Promise<Product[] | null>
    findAllByRating(ratingId: number): Promise<Product[] | null>
    findAllByDiscount(discountId: number): Promise<Product[] | number>
    //findTopRatedProducts(): Promise<Product[] | null>
    //findProductsByBrand(brandid: number): Promise<Product[] | null>



}

