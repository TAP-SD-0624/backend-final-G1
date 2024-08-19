import { CategoryDTO } from './categoryDto'
import { CommentDTO } from './commentDto'
import { discountDTO } from './discountDTO'
import { ratingDto } from './ratingDto'

export type ProductDTO = {
  name: string
  price: number
  description?: string
  brand?: string
  stock: number
  userRatings?: ratingDto[]
  images?: Express.Multer.File[]
  comments?: CommentDTO[]
  categories?: CategoryDTO[]
  discount?: discountDTO
}

export type UpdateProductDTO = {
  id: number
  name?: string
  price?: number
  description?: string
  stock?: number
}
