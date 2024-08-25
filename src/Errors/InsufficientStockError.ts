export class InsufficientStockError extends Error {
  constructor(message: string = 'Not satisfying the needed amount') {
    super(message)
  }
}
