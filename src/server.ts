import 'reflect-metadata'
import { container } from 'tsyringe'
import { WinstonLogger } from './helpers/Logger/WinstonLogger'
import { ILogger } from './helpers/Logger/ILogger'
container.register<ILogger>('ILogger', { useClass: WinstonLogger })
import express from 'express'
import dotenv from 'dotenv'
import sequelize from './config/db'
import swaggerUI from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'
import {
  cartRouter,
  categoryRouter,
  productRouter,
  commentRouter,
  authRouter,
  userRouter,
  wishlistRouter,
  discountRouter,
  brandRouter,
  userRatingRouter,
  dashboardRouter,
  addressRouter,
  orderRouter,
} from './routes'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const Logger = container.resolve<ILogger>('ILogger')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/wishlists', wishlistRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/comments', commentRouter)
app.use('/api/userratings', userRatingRouter)
app.use('/api/discounts', discountRouter)
app.use('/api/brands', brandRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/address', addressRouter)
app.use('/api/orders', orderRouter)

app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

const startServer = async () => {
  try {
    await sequelize.authenticate()
    Logger.log('Database connected!')
    // await sequelize.sync({ alter: true })
    // Logger.log('Database synchronized!')
    app.listen(PORT, () => {
      Logger.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error: any) {
    Logger.log('Unable to connect to the database:')
    Logger.error(error)
  }
}

startServer()
