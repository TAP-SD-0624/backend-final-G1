import { CategoryDTO } from './categoryDto'
import { CommentDTO } from './commentDto'
import { discountDTO } from './discountDTO'
import { GetBrandDTO, GetImageDTO } from './productDto'
import { ratingDto } from './ratingDto'

export type GetProductDashboardDTO = {
  id?: number
  name: string
  price: number
  stock: number
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
