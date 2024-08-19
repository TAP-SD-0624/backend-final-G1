export type CartDTO = {
  userId: number
  products: {
    productId: number
    quantity: number
  }[]
}

// wait until the product dto is created
