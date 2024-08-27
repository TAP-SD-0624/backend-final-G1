import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import sequelize from './config/db'
import swaggerUI from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'
import client from 'prom-client'
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

const register = new client.Registry();
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({
  register
})
const counter = new client.Counter({
  name: 'http_request_count',
  help: 'Count of HTTP requests',
  labelNames: ['method', 'route', 'statusCode']
});

const app = express()
const PORT = process.env.PORT || 3000


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))




register.registerMetric(counter);

app.use(function (req:Request, res:Response, next:NextFunction) {
  counter.labels({
    method: req.method,
    route: req.originalUrl,
    statusCode: res.statusCode
  }).inc();
  next();
});


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
app.get("/metrics", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", client.register.contentType);
  let metrics = await register.metrics();
  res.send(metrics);
});
app.use('/api/orders', orderRouter)

app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected!')
    // await sequelize.sync({ alter: true })
    // console.log('Database synchronized!')
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

startServer()
