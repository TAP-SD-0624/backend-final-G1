import { Cart } from "../models";
import { CartRepository } from "../data-access/CartRepository";
import { injectable } from "tsyringe";
import { CartDTO } from "../DTO/cartDto";

@injectable()
export default class CartService {
    private cartRepository: CartRepository;
    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async createCart(cartData: CartDTO): Promise<Cart> {
        try {
            const newCart = new Cart();
            newCart.userId = cartData.userId;
            const cart = await this.cartRepository.createCart(newCart);
            if (!cart) {
                throw new Error("Failed to create cart");
            }
            return cart;
        } catch (error: any) {
            throw new Error(`Error creating cart: ${error.message}`);
        }
    }

    async getCartByUserId(userId: number): Promise<Cart[] | null> {
        try {
            const cart = await this.cartRepository.findCartByUserId(userId);
            return cart;
        } catch (error) {
            throw new Error(`Error retrieving cart: ${error}`);
        }
    }
    async updateCart(cartId: number, cartData: CartDTO): Promise<Cart | null> {
        try {
            const cart = await this.cartRepository.findById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }

            const newCart = new Cart();
            newCart.userId = cartData.userId;
            const updatedCart = await this.cartRepository.updateCart(cartId, newCart);
            return updatedCart;
        } catch (error) {
            throw new Error(`Error updating cart: ${error}`);
        }
    }

    async deleteCart(cartId: number): Promise<void> {
        try {
            await this.cartRepository.deleteCart(cartId);
        } catch (error) {
            throw new Error(`Error deleting cart: ${error}`);
        }
    }



}