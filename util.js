const path = require('path')
const fs = require('fs')

const getCurrentDirectoryBase = () => {
  return path.basename(process.cwd())
}

const directoryExists = filePath => {
  try {
    return fs.statSync(filePath).isDirectory()
  } catch (err) {
    return false
  }
}

const fileExist = filePath => {
  try {
    return fs.statSync(filePath + '.ts').isFile()
  } catch (err) {
    return false
  }
}

module.exports = { getCurrentDirectoryBase, directoryExists, fileExist }
