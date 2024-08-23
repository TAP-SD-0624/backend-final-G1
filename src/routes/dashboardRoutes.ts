import { Router } from 'express'
import { container } from 'tsyringe'
import { DashboardController } from '../controllers'
import authAndRoleMiddleware from '../middleware/authMiddleware'
import { getMostBoughtProductsOverTimeValidator, getProductsNotBoughtValidator, getProductsPerStateValidator, dropItemsFromListValidator } from '../validations'

const dashboardRouter = Router()
const dashboardController = container.resolve(DashboardController)

dashboardRouter.use(authAndRoleMiddleware(['admin']))

dashboardRouter.get("/getMostBoughtProductsOverTime", getMostBoughtProductsOverTimeValidator, dashboardController.getMostBoughtProductsOverTime.bind(dashboardController));
dashboardRouter.get("/getProductsNotBought", getProductsNotBoughtValidator, dashboardController.getProductsNotBought.bind(dashboardController));
dashboardRouter.post("/DropItemsFromList", dropItemsFromListValidator, dashboardController.DropItemsFromList.bind(dashboardController));
dashboardRouter.get("/getProductsPerState", getProductsPerStateValidator, dashboardController.getProductsPerState.bind(dashboardController));

export default dashboardRouter
