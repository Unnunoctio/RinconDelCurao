import fs from 'fs'
import { BEERS, DISTILLATES, WINES } from '../assets/uploadName.js'

export const getProductImage = (imagePath, category) => {
  try {
    let folderPath = 'others'
    const categoryMapping = {
      [BEERS.name]: BEERS.folder,
      [DISTILLATES.name]: DISTILLATES.folder,
      [WINES.name]: WINES.folder
    }
    if (Object.prototype.hasOwnProperty.call(categoryMapping, category)) {
      folderPath = categoryMapping[category]
    }

    const filePath = `./uploads/${folderPath}/${imagePath}`
    const imageBuffer = fs.readFileSync(filePath)
    const imageBase64 = imageBuffer.toString('base64')

    return `data:image/webp;base64,${imageBase64}`
  } catch (error) {
    return ''
  }
}
