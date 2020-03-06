const helpers = module.exports = {}
const fs = require('fs')
const path = require('path')

helpers.createDirectory = (filePath) => {
  const leadingDirectory = filePath.split(path.sep)
  leadingDirectory.pop()
  let nextPath
  leadingDirectory.forEach(segment => {
    nextPath = nextPath ? path.join(nextPath, segment) : `${path.sep}${segment}`
    if (!fs.existsSync(nextPath) || !fs.statSync(nextPath).isDirectory) {
      fs.mkdirSync(nextPath)
    }
  })
}

helpers.getResolvedPath = (normalizedPath, rootName = 'index') => {
  let resolvedPath, resolvedName
  if (!normalizedPath) {
    resolvedName = rootName
    resolvedPath = resolvedName
  } else {
    resolvedName = normalizedPath.split('/').pop()
    resolvedPath = path.join(...normalizedPath.split('/'))
  }

  return [ resolvedPath, resolvedName ]
}

helpers.getQueryName = (normalizedPath) => {
  if (!normalizedPath) return 'Index'
  return normalizedPath.split('/').map(part => {
    return part.split('-').map(word => `${word[0].toUpperCase()}${word.split('').slice(1).join('').toLowerCase()}`).join('-')
  }).join('')
}

helpers.deleteEmptyDirectory = (filePath) => {
  const leadingDirectory = filePath.split(path.sep)
  leadingDirectory.pop()
  let empty = true
  while (empty && leadingDirectory.length > 0) {
    const directory = `${path.sep}${leadingDirectory.join(path.sep)}`
    if (fs.readdirSync(directory).length > 0) {
      empty = false
    } else {
      console.log('removing directory', { directory })
      fs.rmdirSync(directory)
    }

    leadingDirectory.pop()
  }
}

helpers.getMetaDataFilename = (normalizedPath) => {
  return normalizedPath.split('/').join('___')
}
