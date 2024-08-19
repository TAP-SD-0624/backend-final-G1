import { supbaseClient } from '../../config/Storage'
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

    // const data = supbaseClient.storage
    // .from('Storage')
    // .getPublicUrl('images/imageee.png')

    // console.log(data.data.publicUrl)
  } catch (ex) {
    console.log(ex)
  }
  return imagesUrl
}

// export const ReadAllImage = async (id: number) => {
//   try {
//     const data = await supbaseClient.storage
//       .from('Storage')
//       .list(`images/${id}`)

//     return data
//   } catch (ex) {
//     console.log(ex)
//   }
// }
