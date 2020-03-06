const config = require('../config')
const { addToSitemap } = require('./sitemap')

const defaultPagesToIgnore = [
  '/dev-404-page/',
  '/404/',
  '/404.html',
  '/offline-plugin-app-shell-fallback/'
]

const pagesToIgnore = [
  ...defaultPagesToIgnore,
  ...((config.build && config.localization && config.localization.ignore) || [])
]

module.exports = ({ page, actions }) => {
  const { createPage } = actions
  if (pagesToIgnore.includes(page.path)) {
    if (!defaultPagesToIgnore.includes(page.path)) addToSitemap(page.path)
    return Promise.resolve()
  }

  return new Promise(resolve => {
    config.availableLanguages.forEach(({ key }, index) => {
      let createLocalizedPages = true
      if (config.build && config.localization && typeof config.localization.createLocalizedPages === 'boolean') {
        createLocalizedPages = config.localization.createLocalizedPages
      }

      if (createLocalizedPages) {
        const localizedPath = `/${key}${page.path}`
        createPage({
          ...page,
          path: localizedPath
        })

        addToSitemap(localizedPath)
      }

      let createDefaultPages = true
      if (config.build && config.localization && typeof config.localization.createDefaultPages === 'boolean') {
        createDefaultPages = config.localization.createDefaultPages
      }

      if (index === 0 && createDefaultPages) {
        createPage({
          ...page,
          path: page.path
        })

        addToSitemap(page.path)
      }
    })

    resolve()
  })
}
