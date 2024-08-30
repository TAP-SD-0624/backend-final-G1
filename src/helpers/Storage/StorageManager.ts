import { container } from 'tsyringe'
import { supbaseClient } from '../../config/Storage'
import { ILogger } from '../Logger/ILogger'

const Logger = container.resolve<ILogger>('ILogger')

export const WriteAllImages = async (id: number, image: any) => {
  const imagesUrl: string[] = []
  try {
    for (let i = 0; i < image.length; i++) {
      const { data, error } = await supbaseClient.storage
        .from('Storage')
        .upload(`images/${id}/${i}.png`, image[i].buffer, {
          contentType: 'image/png',
        })
      if (data) {
        const url = supbaseClient.storage
          .from('Storage')
          .getPublicUrl(data?.path)
        imagesUrl.push(url.data.publicUrl)
      }
    }
    return imagesUrl
  } catch (ex: unknown) {
    Logger.error(ex as Error)
  }
  return imagesUrl
}
