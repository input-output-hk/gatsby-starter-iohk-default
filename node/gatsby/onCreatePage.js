const config = require('../../site.config.json')
const { addToSitemap } = require('./sitemap')

const defaultPagesToIgnore = [
  '/dev-404-page/',
  '/404/',
  '/404.html',
  '/offline-plugin-app-shell-fallback/'
]

const pagesToIgnore = [
  ...defaultPagesToIgnore,
  ...((config.build && config.build.localized && config.build.localized.ignore) || [])
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
      if (config.build && config.build.localized && typeof config.build.localized.createLocalizedPages === 'boolean') {
        createLocalizedPages = config.build.localized.createLocalizedPages
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
      if (config.build && config.build.localized && typeof config.build.localized.createDefaultPages === 'boolean') {
        createDefaultPages = config.build.localized.createDefaultPages
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
