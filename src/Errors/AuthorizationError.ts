export class AuthorizationError extends Error {
  constructor(
    message: string = 'You do not have authority to do this request'
  ) {
    super(message)
  }
}
