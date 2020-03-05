const fs = require('fs')
const path = require('path')
const config = require('../site.config.json')

const paths = process.argv.slice(2)

function createDirectory (filePath) {
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

function getResolvedPath (normalizedPath, rootName = 'index') {
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

function createNetlifyCollection (normalizedPath) {
  const [ markdownRelativePath ] = getResolvedPath(normalizedPath)
  const [ resolvedPath, name ] = getResolvedPath(normalizedPath, 'home')
  const jsContent = `export default {
  name: '${(normalizedPath && normalizedPath.split('/').join('_')) || name}_page',
  label: '${name} page',
  folder: 'resources/content/${markdownRelativePath}',
  create: false,
  delete: false,
  fields: [
    {
      label: 'Title',
      name: 'title',
      widget: 'string'
    },
    {
      name: 'content',
      label: '${name} page content',
      widget: 'object',
      fields: [
        {
          name: 'default_content',
          label: 'Default content',
          widget: 'string'
        }
      ]
    }
  ]
}
`

  const fullPath = path.join(__dirname, '..', 'netlify', 'collections', 'pages', `${resolvedPath}.js`)
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile) {
    console.log(`Netlify collection for page ${resolvedPath}.js already exists`)
    return
  }

  createDirectory(fullPath)
  fs.writeFileSync(fullPath, jsContent, { encoding: 'utf8' })
  console.log(`Netlify collection created ${resolvedPath}.js`)

  const indexPath = path.join(__dirname, '..', 'netlify', 'collections', 'pages', 'index.js')
  const indexContent = fs.readFileSync(indexPath, { encoding: 'utf8' })
  const newIndexContent = indexContent
    .replace(/(import\s[^\s]+\sfrom\s'[^']+'\n)/, `$1import ${resolvedPath.replace(path.sep, '')} from './${resolvedPath.split(path.sep).join('/')}'\n`)
    .replace(/(export\sdefault\s\[)([^\]]+)(\])/, (_, a, b, c) => {
      return `${a}${b.replace(/\n$/, `,\n  ${resolvedPath.replace(path.sep, '')}\n`)}${c}`
    })

  fs.writeFileSync(indexPath, newIndexContent, { encoding: 'utf8' })
  console.log('Netlify collection index updated')
}

function getQueryName (normalizedPath) {
  if (!normalizedPath) return 'Index'
  return normalizedPath.split('/').map(part => {
    return part.split('-').map(word => `${word[0].toUpperCase()}${word.split('').slice(1).join('').toLowerCase()}`).join('-')
  }).join('')
}

function createMarkdown (normalizedPath) {
  const contentRelativePath = path.join('resources', 'content', 'pages')
  const [ markdownRelativePath, markdownName ] = getResolvedPath(normalizedPath)

  config.availableLanguages.forEach(language => {
    const markdownFileRelativePath = path.join(contentRelativePath, markdownRelativePath, `${markdownRelativePath.split(path.sep).join('-')}-${language.key}.md`)
    const markdownFilePath = path.join(__dirname, '..', markdownFileRelativePath)
    const markdown = `---
title: ${language.key} (${language.label}) ${markdownName} page content
content:
  default_content: |
    This page was created using npm run create-pages. This content can be edited in ${markdownFileRelativePath}. The query can be updated in src/queries/${getQueryName(normalizedPath)}Page.js. The Netlify collection can be updated in netlify/collections/pages/${markdownRelativePath}.js.
---    
`

    if (fs.existsSync(markdownFilePath) && fs.statSync(markdownFilePath).isFile) {
      console.log(`Markdown file for page ${markdownFileRelativePath} already exists`)
    } else {
      createDirectory(markdownFilePath)
      fs.writeFileSync(markdownFilePath, markdown, { encoding: 'utf8' })
      console.log(`Markdown file created ${markdownFileRelativePath}`)
    }
  })
}

function createQuery (normalizedPath) {
  const queryName = getQueryName(normalizedPath)
  const queryRelativePath = path.join('src', 'queries', `${queryName}PageQuery.js`)
  const [ markdownRelativePath ] = getResolvedPath(normalizedPath)
  const queryContent = `import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Language from '@input-output-hk/front-end-core-components/components/Language'

const ${queryName}PageQuery = ({ render }) => (
  <Language.Consumer>
    {({ key: lang }) => (
      <StaticQuery
        query={graphql\`
          query {
            allFile(filter:{relativePath:{glob:"content/pages/${markdownRelativePath}/*.md"}}) {
              nodes{
                relativePath,
                childMarkdownRemark{
                  frontmatter {
                    content {
                      default_content
                    }
                  }
                }
              }
            }
          }
        \`}
        render={({ allFile }) => {
          const content = allFile.nodes.filter(node => node.relativePath === \`content/pages/${markdownRelativePath}/${markdownRelativePath.split(path.sep).join('-')}-\${lang}.md\`).shift()
          if (!content || !content.childMarkdownRemark) throw new Error(\`No ${markdownRelativePath.split(path.sep).join('-')} translations found for language \${lang}\`)
          return render(content.childMarkdownRemark.frontmatter.content)
        }}
      />
    )}
  </Language.Consumer>
)

${queryName}PageQuery.propTypes = {
  render: PropTypes.func.isRequired
}

export default ${queryName}PageQuery
`

  const fullPath = path.join(__dirname, '..', queryRelativePath)
  if (fs.existsSync(queryRelativePath) && fs.statSync(queryRelativePath).isFile) {
    console.log(`Query already exists ${queryRelativePath}`)
    return
  }

  fs.writeFileSync(fullPath, queryContent, { encoding: 'utf8' })
  console.log(`Query created ${queryRelativePath}`)
}

function createPage (normalizedPath) {
  const queryName = getQueryName(normalizedPath)
  const [ pageRelativePath ] = getResolvedPath(normalizedPath)
  const previousDirectories = normalizedPath.split('/').map(() => '..').join('/')
  const pageContent = `import React from 'react'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Layout from '${previousDirectories}/components/Layout'
import ${queryName}PageQuery from '${previousDirectories}/queries/${queryName}PageQuery'

export default () => (
  <${queryName}PageQuery
    render={(content) => (
      <Layout>
        <Container maxWidth='lg'>
          <Box marginTop={6} marginBottom={10}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p>{content.default_content}</p>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Layout>
    )}
  />
)
`

  const fullPath = path.join(__dirname, '..', 'src', 'pages', `${pageRelativePath}.js`)
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile) {
    console.log(`Page already exists ${pageRelativePath}.js`)
    return
  }

  createDirectory(fullPath)
  fs.writeFileSync(fullPath, pageContent, { encoding: 'utf8' })
  console.log(`Page created ${pageRelativePath}.js`)
}

paths.forEach(path => {
  console.log(`Creating page ${path}`)
  const normalizedPath = path.replace(/^\//, '').replace(/\/$/, '')
  createNetlifyCollection(normalizedPath)
  createMarkdown(normalizedPath)
  createQuery(normalizedPath)
  createPage(normalizedPath)
})
