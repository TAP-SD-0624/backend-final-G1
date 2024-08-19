import { Router } from 'express'
import { container } from 'tsyringe'
import { UserController } from '../controllers/userController'
import authAndRoleMiddleware from '../middleware/authMiddleware'

const userRouter = Router()
const userController = container.resolve(UserController)

userRouter.post('/', userController.createUser.bind(userController))

userRouter.get(
  '/id/:id',
  authAndRoleMiddleware(['user', 'admin']),
  userController.getUserById.bind(userController)
)
userRouter.get(
  '/email/:email',
  authAndRoleMiddleware(['user', 'admin']),
  userController.getUserByEmail.bind(userController)
)

userRouter.get(
  '/',
  authAndRoleMiddleware(['admin']),
  userController.getAllUsers.bind(userController)
)

userRouter.patch(
  '/id/:id',
  authAndRoleMiddleware(['admin']),
  userController.updateUser.bind(userController)
)
userRouter.delete(
  '/id/:id',
  authAndRoleMiddleware(['admin']),
  userController.deleteUser.bind(userController)
)

userRouter.patch(
  '/password/:id',
  authAndRoleMiddleware(['user', 'admin']),
  userController.editUserPassword.bind(userController)
)

userRouter.patch(
  '/role/:id',
  authAndRoleMiddleware(['admin']),
  userController.changeRole.bind(userController)
)
export default userRouter
