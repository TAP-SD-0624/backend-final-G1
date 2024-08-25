export type CartDTO = {
  id: number
  userId: number
  products: CartProductDTO[]
}

export type CartProductDTO = {
  id: number
  name: string
  price: number
  brand: string
  stock: number
  description?: string
  quantity: number
}
