import { GetBrandDTO, GetProductDTO } from './productDto'

export type CartDTO = {
  id: number
  userId: number
  products: GetProductDTO[]
}

export type CartProductDTO = {
  id: number
  name: string
  price: number
  brand: GetBrandDTO
  stock: number
  description?: string
  quantity: number
}
