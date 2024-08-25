export class InternalServerError extends Error {
  constructor(message: string = 'internal server error') {
    super(message)
  }
}
