const { addToSitemap } = require('./sitemap')
const createClientRoutePages = require('./pages/clientRoutes')

module.exports = async ({ graphql, actions }) => {
  const { createPage } = actions
  function createPageAction () {
    addToSitemap(arguments[0].path)
    createPage.apply(createPage, arguments)
  }

  createClientRoutePages({ graphql, createPage: createPageAction })
  // Create more dynamic pages here
}
