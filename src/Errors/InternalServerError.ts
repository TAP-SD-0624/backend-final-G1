export class InternalServerError extends Error {
  constructor(
    message: string = 'internal server error, please try again later'
  ) {
    super(message)
  }
}
