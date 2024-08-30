export class EmptyCartError extends Error {
  constructor(message: string = 'The cart is empty') {
    super(message)
  }
}
