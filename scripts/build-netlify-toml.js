const fs = require('fs')
const path = require('path')
const config = require('../node/config')

const redirects = {}

function addRedirect (staticPath, content, status = 200, to = null) {
  if (redirects[staticPath]) return content
  const withRedirect = `${content}
[[redirects]]
  from = "${staticPath}*"
  to = "${to || staticPath}"
  status = ${status}
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

  config.availableLanguages.forEach(({ key: lang }) => {
    if (config.localization.createLocalizedPages) content = addRedirect(`/${lang}/`, content, 404, `/${lang}/404/index.html`)
  })

  fs.writeFileSync(path.join(__dirname, '..', 'netlify.toml'), content, { encoding: 'utf-8' })
}

buildNetlifyToml()
