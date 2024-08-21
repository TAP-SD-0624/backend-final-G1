import { Router } from 'express'
import { container } from 'tsyringe'
import { DashboardController } from '../controllers'
import authAndRoleMiddleware from '../middleware/authMiddleware'

const dashboardRouter = Router()
const dashboardController = container.resolve(DashboardController)

dashboardRouter.use(authAndRoleMiddleware(['admin']))


export default dashboardRouter
