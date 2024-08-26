import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models'
import { isTokenBlacklisted } from '../helpers/tokenBlacklist'
import { AuthenticatedRequest } from '../helpers/AuthenticatedRequest'
import { CustomError } from '../Errors/CustomError'

const authAndRoleMiddleware = (allowedRoles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1] || req.cookies?.token

    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' })
    }

    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({ error: 'Token has been invalidated' })
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'jwt_secret'
      ) as { id: number; role: string }
      const user = await User.findByPk(decoded.id)

      if (!user) {
        throw new CustomError('User not found', 401)
      }

      if (user.role === 'admin' || allowedRoles.includes(user.role)) {
        req.user = user
        return next()
      } else {
        throw new CustomError('Access forbidden: insufficient role', 403)
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'Token has expired' })
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 'Invalid token' })
      }
      if (error instanceof CustomError) {
        return res.status(error.status).json({ error: error.message })
      }
      console.error('Authorization error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export default authAndRoleMiddleware
