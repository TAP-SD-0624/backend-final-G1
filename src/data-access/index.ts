import { Comment, Product, User , Category } from "../models";
import { CommentRepository } from "./CommentRepository";
import { UserRepository } from "./UserRepository";
import { IUserRepository } from "./Interfaces/IUserRepository";

import { CartRepository } from "./CartRepository";
import { ICartRepository } from "./Interfaces/ICartRepository";
import { Cart } from "../models";
import { ICommentRepository } from "./Interfaces/ICommentRepository";
import { ProductRepository } from "./ProductRepository";

import { ICategoryRepository } from './Interfaces/ICategoryRepository';
import { CategoryRepository } from './CategoryRepository';

export const userRepository = new UserRepository(User);
export const cartRepository = new CartRepository(Cart);
export const commentRepository = new CommentRepository(Comment);
export const productRepository = new ProductRepository(Product);
export const categoryRepository = new CategoryRepository(Category);

export { IUserRepository, ICartRepository, ICommentRepository , ICategoryRepository };
