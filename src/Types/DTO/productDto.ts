import { CategoryDTO } from './categoryDto'
import { CommentDTO } from './commentDto'
import { discountDTO } from './discountDTO'
import { ratingDto } from './ratingDto'

export type PostProductDTO = {
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

export type GetProductDTO = {
  id: number
  name: string
  price: number
  stock: number
  quantity?: number
  averageRating?: number
  ratingCount?: number
  description?: string
  discount?: discountDTO
  categories?: CategoryDTO[]
  comments?: CommentDTO[]
  userRatings?: ratingDto[]
  brand?: GetBrandDTO
  images?: GetImageDTO[]
}

export type GetBrandDTO = {
  icon?: string
  name: string
}
export type GetImageDTO = {
  publicURL: string
}

export type UpdateProductDTO = {
  id: number
  name?: string
  price?: number
  description?: string
  stock?: number
}
