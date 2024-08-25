import { Router } from 'express'
import { container } from 'tsyringe'
import AuthController from '../controllers/authController'
import { validateLogin, validateRegister, validateLogout } from '../validations'

const authRouter = Router()
const authController = container.resolve(AuthController)

authRouter.post(
  '/login',
  validateLogin,
  authController.login.bind(authController)
)
authRouter.post(
  '/register',
  validateRegister,
  authController.register.bind(authController)
)
authRouter.post(
  '/logout',
  validateLogout,
  authController.logout.bind(authController)
)

export default authRouter
