import { Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'
import UserService from '../services/user.service'
import { UserDTO } from '../Types/DTO'
import { AuthenticatedRequest } from '../helpers/AuthenticatedRequest'
import { ResponseCodes } from '../enums/ResponseCodesEnum'
import { BadRequestError, ValidationError } from '../Errors'
import { NotFoundError } from '../Errors'

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) { }

  async createUser(req: Request, res: Response) {
    try {
      const userData: UserDTO = req.body
      const user = await this.userService.createUser(userData)
      return res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'User Created successfully',
        user,
      })
    } catch (error: unknown) {
      if(error instanceof ValidationError){
        return res.status(400).json({
          ResponseCode:ResponseCodes.BadRequest,
          Message: error.message
        })
      }
      return res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error',
      })
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10)
      const user = await this.userService.getUserById(userId)

      if (!user) {
        return res.status(404).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'User Not Found',
        })
      }
      user.password = '****************'

      res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'User Retrieved successfully',
        user,
      })
      return user
    } catch (error: unknown) {
      return res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error',
      })
    }
  }

  async getUserByEmail(req: Request, res: Response) {
    try {
      const email = String(req.params.email)

      const user = await this.userService.getUserByEmail(email)

      if (!user) {
        return res.status(404).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'User Not Found',
        })
      }
      user.password = '****************'
      res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'User Retrieved successfully',
        user,
      })
      return user
    } catch (error: unknown) {
      return res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error',
      })
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10)
      const userData: UserDTO = req.body
      const updatedUser = await this.userService.updateUser(userId, userData)
      if (!updatedUser) {
        return res.status(404).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'User Not Found',
        })
      }
      res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'User Updated successfully',
        updatedUser,
      })
    } catch (error: unknown) {
      return res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error',
      })
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10)
      //check if user exists
      const user = await this.userService.getUserById(userId)
      if (!user) {
        return res.status(404).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'User Not Found',
        })
      }
      await this.userService.deleteUser(userId)
      res.status(204).send()
    } catch (error: unknown) {
      res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error',
      })
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers()
      users.forEach((user) => {
        user.password = '****************'
      })
      res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Users Retrieved successfully',
        users,
      })
    } catch (error: unknown) {
      return res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error',
      })
    }
  }

  async editUserPassword(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10)
    const { oldPassword, newPassword } = req.body

    try {
      const user = await this.userService.getUserById(userId)
      if (!user) {
        return res.status(404).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'User Not Found',
        })
      }
      const result = await this.userService.editUserPassword(
        Number(userId),
        oldPassword,
        newPassword
      )
      res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'User Password updated successfully',
        result,
      })
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          ResponseCode:ResponseCodes.NotFound,
          Message:error.message
        })
      }
      if (error instanceof BadRequestError) {
        return res.status(400).json({
          ResponseCode: ResponseCodes.BadRequest,
          Message: error.message
        })
      }
      return res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error',
      })
    }
  }

  // controller function to change the role of a user
  async changeRole(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10)
      const role = req.body.role

      const user = await this.userService.getUserById(userId)
      if (!user) {
        return res.status(404).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'User Not Found',
        })
      }

      const updatedUser = await this.userService.changeRole(userId, role)
      if (!updatedUser) {
        return res.status(404).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'User Not Found',
        })
      }

      updatedUser.password = '****************'
      res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'Role changed successfully',
        updatedUser,
      })
    } catch (error: unknown) {
      return res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error',
      })
    }
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(403).json({
          ResponseCode: ResponseCodes.Forbidden,
          Message: 'User Not Found',
        })
      }

      const user = await this.userService.getUserById(req.user.id)
      if (!user) {
        return res.status(404).json({
          ResponseCode: ResponseCodes.NotFound,
          Message: 'User Not Found',
        })
      }

      res.status(200).json({
        ResponseCode: ResponseCodes.Success,
        Message: 'User  Retrieved successfully',
        user,
      })
    } catch (error: unknown) {
      return res.status(500).json({
        ResponseCode: ResponseCodes.InternalServerError,
        Message: 'Internal server error',
      })
    }
  }
}
