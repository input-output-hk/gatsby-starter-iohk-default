const fs = require('fs')
const path = require('path')
const config = require('../node/config')

const redirects = {}

function addRedirect (staticPath, content) {
  if (redirects[staticPath]) return content
  const withRedirect = `${content}
[[redirects]]
  from = "${staticPath}*"
  to = "${staticPath}"
  status = 200
`

  redirects[staticPath] = true
  return withRedirect
}

function buildNetlifyToml () {
  const baseTomlPath = path.join(__dirname, '..', '.netlify.toml')
  let content = ''
  if (fs.existsSync(baseTomlPath) && fs.statSync(baseTomlPath).isFile) {
    content = fs.readFileSync(path.join(__dirname, '..', '.netlify.toml'), { encoding: 'utf-8' })
  }

  config.routes.forEach(({ path: routePath }) => {
    const staticPath = routePath.split(':').shift()
    config.availableLanguages.forEach(({ key: lang }, index) => {
      if (config.localization.createDefaultPages && index === 0) content = addRedirect(staticPath, content)
      if (config.localization.createLocalizedPages) content = addRedirect(`/${lang}${staticPath}`, content)
    })
  })

  fs.writeFileSync(path.join(__dirname, '..', 'netlify.toml'), content, { encoding: 'utf-8' })
}

buildNetlifyToml()
