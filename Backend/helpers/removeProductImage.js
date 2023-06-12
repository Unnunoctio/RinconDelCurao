import fs from 'fs'
import { BEERS, DISTILLATES, WINES } from '../assets/uploadName.js'

export const removeProductImage = (imagePath, productCategory) => {
  let folderPath = 'others'
  const categoryMapping = {
    [BEERS.name]: BEERS.folder,
    [DISTILLATES.name]: DISTILLATES.folder,
    [WINES.name]: WINES.folder
  }
  if (Object.prototype.hasOwnProperty.call(categoryMapping, productCategory)) {
    folderPath = categoryMapping[productCategory]
  }

  const filePath = `./uploads/${folderPath}/${imagePath}`

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error(error.message)
  }
}
