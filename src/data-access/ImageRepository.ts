import { Image } from '../models'
import { IImageRepository } from './Interfaces'
import { RepositoryBase } from './RepositoryBase'

export class ImageRepository
  extends RepositoryBase<Image>
  implements IImageRepository {}
