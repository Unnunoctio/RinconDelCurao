import axios from 'axios'
import shortid from 'shortid'
import fs from 'fs'
import { BEERS, DISTILLATES, WINES } from '../assets/uploadName.js'

export const uploadProductImage = async (imageUrl, productCategory) => {
  const id = shortid.generate()
  const fileName = `${id}.webp`

  let folderPath = 'others'
  const categoryMapping = {
    [BEERS.name]: BEERS.folder,
    [DISTILLATES.name]: DISTILLATES.folder,
    [WINES.name]: WINES.folder
  }
  if (Object.prototype.hasOwnProperty.call(categoryMapping, productCategory)) {
    folderPath = categoryMapping[productCategory]
  }

  const filePath = `./uploads/${folderPath}/${fileName}`

  try {
    const response = await axios.get(imageUrl, { responseType: 'stream' })
    if (response.status !== 200) return null

    const fileStream = fs.createWriteStream(filePath)
    await new Promise((resolve, reject) => {
      response.data.pipe(fileStream)
      fileStream.on('finish', resolve)
      fileStream.on('error', reject)
    })

    return fileName
  } catch (error) {
    // console.error(error)
    return null
  }
}
