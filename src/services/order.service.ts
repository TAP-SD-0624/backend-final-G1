import { Address, Cart, Order } from '../models'
import { OrderDTO } from '../Types/DTO'
import { inject, injectable } from 'tsyringe'
import {
  orderRepository,
  cartRepository,
  productRepository,
  addressRepository,
} from '../data-access'
import { OrderStatus } from '../enums/OrderStatusEnum'
import {
  ordersToOrdersDTO,
  orderToOrderDTO,
} from '../helpers/orders/orderToOrderDTO'
import { ValidationError as VE } from 'sequelize'
import sequelize from '../config/db'
import {
  InternalServerError,
  BadRequestError,
  ValidationError,
  EmptyCartError,
} from '../Errors'
import { InsufficientStockError } from '../Errors/InsufficientStockError'
import { ILogger } from '../helpers/Logger/ILogger'

@injectable()
export default class OrderService {
  constructor(@inject('ILogger') private logger: ILogger) {}

  public async createOrder(
    userId: number,
    isPaid: boolean,
    addressId?: number
  ): Promise<OrderDTO> {
    console.log('creating order')
    //lets make sure we have items in our cart.
    let cart: Cart | null = {} as Cart
    try {
      cart = await cartRepository.findCartByUserId(userId)
    } catch (ex: any) {
      throw new InternalServerError()
    }
    //throw badrequest when the cart does not exist, this means the user is new and never added any item to the cart,"empty cart"
    if (!cart) {
      throw new EmptyCartError(
        'Can not create an order with an empty cart, please add available products to your cart first'
      )
    }
    //throw badreqeust when the cart is empty.
    if (cart.products.length < 1) {
      throw new EmptyCartError(
        'Can not create an order with an empty cart, please add available products to your cart first'
      )
    }

    const t = await sequelize.transaction()

    try {
      //make sure all items exists with enough amount in our database.
      await Promise.all(
        cart.products.map(async (item) => {
          const updatedProduct = await productRepository.DecreaseProductCount(
            item.id,
            (item as any).CartProduct?.quantity,
            t
          )
          //if not enough, we will throw an error and roll back all our database changes.
          if (!updatedProduct) {
            throw new InsufficientStockError(
              `product with the name ${item.name} does not have enough in the stock, please update your cart to match the correct number`
            )
          }
        })
      )
      //we made sure all our items exists, lets now create our order

      //get our address and add it to the order
      let address: Address | null = {} as Address
      if (addressId) {
        address = await addressRepository.getAddressByIdAndUserId(
          addressId,
          userId
        )
        if (!address)
          throw new BadRequestError(
            'prodvided address does not exist for this user, please use a valid address'
          )
      } else {
        const addresses = await addressRepository.getAddressesByUserId(userId)
        if (addresses.length < 1)
          throw new BadRequestError(
            'this user does not have and addresses, please add a new address to this user'
          )
        else address = addresses[0]
      }

      const newOrder = new Order()
      newOrder.isPaid = isPaid ?? false
      newOrder.status = OrderStatus.processed
      newOrder.userId = userId
      newOrder.addressId = address.id
      console.log('creating order')
      const order = await orderRepository.createOrder(
        newOrder,
        cart.products,
        t
      )

      await cartRepository.ClearCart(cart.id, t)
      await t.commit()
      console.log(order.toJSON())
      return orderToOrderDTO(order)
    } catch (error: any) {
      console.log(error)
      await t.rollback()
      if (error instanceof VE) {
        throw new ValidationError(error.message)
      }
      if (error instanceof InsufficientStockError) throw error
      console.log(error)
      this.logger.error(error)
      throw new InternalServerError()
    }
  }

  public async getOrderById(
    id: number,
    userId: number
  ): Promise<OrderDTO | null> {
    try {
      const order = await orderRepository.findByIdAndUserId(id, userId)
      if (!order) {
        return null
      }
      return orderToOrderDTO(order)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }

  public async getOrders(userId: number): Promise<OrderDTO[] | null> {
    try {
      const orders = await orderRepository.findByUserId(userId)
      if (!orders) {
        return null
      }
      return ordersToOrdersDTO(orders)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }

  public async updateOrder(
    id: number,
    userId: number,
    status: OrderStatus,
    isPaid: boolean = false
  ): Promise<OrderDTO | null> {
    try {
      const oldOrder = await orderRepository.findByIdAndUserId(id, userId)
      if (!oldOrder) {
        return null
      }
      const oldOrderJSON = await oldOrder.toJSON()
      isPaid = isPaid || oldOrderJSON.isPaid
      if (oldOrderJSON.status === OrderStatus.processed) {
        if (status !== OrderStatus.outForDelivery) {
          throw new BadRequestError(
            "You can't change the status of a processed order to anything other than outForDelivery."
          )
        }
      }
      if (oldOrderJSON.status === OrderStatus.outForDelivery) {
        if (status !== OrderStatus.delivered && !isPaid) {
          throw new BadRequestError(
            'You can only change the status of an outForDelivery order to delivered if it is paid.'
          )
        }
      }

      if (oldOrderJSON.status === OrderStatus.delivered) {
        throw new BadRequestError(
          "You can't change the status of a delivered order."
        )
      }
      const updateOrder = new Order()
      updateOrder.status = status
      updateOrder.id = id
      updateOrder.isPaid = isPaid
      const order = await orderRepository.update(updateOrder)
      return orderToOrderDTO(order!)
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        throw error
      }
      if (error instanceof VE) {
        throw new ValidationError(error.message)
      }
      this.logger.error(error)
      throw new InternalServerError()
    }
  }

  public async cancelOrder(id: number, userId: number): Promise<boolean> {
    try {
      const oldOrder = await orderRepository.findByIdAndUserId(id, userId)
      if (!oldOrder) {
        return false
      }
      const oldOrderJSON = oldOrder?.toJSON()
      if (oldOrderJSON?.status !== OrderStatus.processed) {
        return false
      }
      return await orderRepository.delete(id)
    } catch (error: any) {
      this.logger.error(error)
      throw new InternalServerError()
    }
  }
}
