import { Cart } from '../models'
import { ICartRepository } from './Interfaces/ICartRepository'
import { RepositoryBase } from './RepositoryBase'

export class CartRepository
    extends RepositoryBase<Cart>
    implements ICartRepository {

    async createCart(cartData: Cart): Promise<Cart> {
        try {
            return await this.model.create(cartData);
        } catch (error) {
            throw new Error(`Error creating cart: ${error}`);
        }
    }
    async findCartByUserId(userId: number): Promise<Cart[]> {
        try {
            return await this.model.findAll({ where: { userId } });
        } catch (error) {
            throw new Error(`Error finding cart by userId: ${error}`);
        }
    }

    // get cart items by cart id
    async findCartProducts(cartId: number): Promise<Cart | null> {
        try {
            return await this.model.findByPk(cartId, {
                include: { all: true }
            });
            
        } catch (error) {
            throw new Error(`Error finding cart products: ${error}`);
            
        }
    }

    async updateCart(id: number, cartData: Cart): Promise<Cart | null> {
        try {
            const [affectedRows, [updatedCart]] = await this.model.update(cartData, {
                where: { id },
                returning: true
            });
            return affectedRows > 0 ? updatedCart : null;
        } catch (error) {
            throw new Error(`Error updating cart: ${error}`);
        }
    }

    async deleteCart(id: number): Promise<boolean> {
        try {
            const deleted = await this.model.destroy({ where: { id } });
            return deleted > 0;
        } catch (error) {
            throw new Error(`Error deleting cart: ${error}`);
        }
    }

}
