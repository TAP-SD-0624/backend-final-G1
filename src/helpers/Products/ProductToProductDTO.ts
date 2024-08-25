import { ratingDto } from '../../Types/DTO/ratingDto'
import { CategoryDTO, CommentDTO } from '../../Types/DTO'
import { GetProductDTO } from '../../Types/DTO/productDto'
import { Product } from '../../models'

export const ProductToProductDTO = (p: Product) => {
  const product = p.toJSON()

  const categories: CategoryDTO[] = [] as CategoryDTO[]

  product.categories.forEach((item) => {
    const category: CategoryDTO = { name: item.name, id: item.id }
    categories.push(category)
  })

  // map comments.
  const comments: CommentDTO[] = []
  product.comments.forEach((item) => {
    const comment: CommentDTO = {
      content: item.content,
      id: item.id,
      productId: item.productId,
      userId: item.userId,
    }
    comments.push(comment)
  })

  //map userRatings.
  const ratings: ratingDto[] = []
  product.ratings.forEach((item) => {
    const rating: ratingDto = {
      value: item.rating,
    }
    ratings.push(rating)
  })

  const productDTO: GetProductDTO = {
    id: product.id,
    name: product.name,
    price: product.price,
    stock: product.stock,
    brand: { name: product.brand.name, icon: product.brand.icon },
    description: product.description,
    quantity: (product as any).CartProduct.quantity,
    discount: { discountRate: product.discount?.discountRate },
    averageRating: product.averageRating,
    categories,
    comments,
    userRatings: ratings,
    ratingCount: product.ratingCount,
    images: product.images,
  } as GetProductDTO
  return productDTO
}
