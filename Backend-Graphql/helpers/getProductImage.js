import https from 'https'
import shortid from 'shortid'
import fs from 'fs'
import { BEERS, DISTILLATES, WINES } from '../assets/uploadName.js'

export const getProductImage = async (imageUrl, productCategory) => {
  const id = shortid.generate()
  const fileName = `${id}.webp`

  let folderPath = 'others'
  switch (productCategory) {
    case BEERS.name:
      folderPath = BEERS.folder
      break
    case DISTILLATES.name:
      folderPath = DISTILLATES.folder
      break
    case WINES.name:
      folderPath = WINES.folder
      break
  }
  const filePath = `./uploads/${folderPath}/${fileName}`

  // TODO: Peticion https
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath)
        res.pipe(fileStream)
        fileStream.on('finish', () => {
          fileStream.close()
          resolve(fileName)
        })
        fileStream.on('error', (err) => {
          console.error(err)
          resolve(null)
        })
      } else {
        resolve(null)
      }
    }).on('error', (err) => {
      console.error(err)
      resolve(null)
    })
  })
}
