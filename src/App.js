import React from 'react'
import PropTypes from 'prop-types'
import { Location } from '@reach/router'
import Language from '@input-output-hk/front-end-core-components/components/Language'
import Theme from '@input-output-hk/front-end-core-components/components/Theme'
import { Provider as LinkProvider } from '@input-output-hk/front-end-core-components/components/Link'
import Styles from '@input-output-hk/front-end-site-components/components/Styles'
import * as themes from '@input-output-hk/front-end-themes'
import { ThemeProvider as MaterialUIThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { analytics, theme } from '@input-output-hk/front-end-core-libraries'
import { navigate, Link as GatsbyLink } from 'gatsby'
import config from './config'

// Used to render all links via @input-output-hk/front-end-core-components/components/Link
const Link = (props) => {
  const componentProps = { ...props }
  let Component = GatsbyLink
  if (props.isStatic || !props.isRelative) {
    Component = 'a'
    if (!props.isRelative) {
      componentProps.target = '_blank'
      componentProps.rel = 'noopener noreferrer'
    }
  } else {
    componentProps.to = componentProps.href
    delete componentProps.href
  }

  delete componentProps.isStatic
  delete componentProps.isRelative

  return (
    <Component {...componentProps} />
  )
}

Link.propTypes = {
  isStatic: PropTypes.bool.isRequired,
  isRelative: PropTypes.bool.isRequired
}

const App = ({ element }) => {
  function languageOnUpdate ({ lang, prevLang, url, prevURL }) {
    if (prevURL && url !== prevURL) navigate(url)
    if (prevLang && lang !== prevLang) analytics.autoCapture({ category: analytics.constants.LANGUAGE, action: 'language_updated', label: lang })
  }

  function themeOnUpdate ({ theme, prevTheme }) {
    if (prevTheme && theme !== prevTheme) analytics.autoCapture({ category: analytics.constants.THEME, action: 'theme_updated', label: theme })
  }

  function getThemes () {
    return config.availableThemes.map(key => ({ key, config: themes[key] }))
  }

  return (
    <Location>
      {({ location: { pathname, search, hash } }) => (
        <Language.Provider
          location={{ pathname, search, hash }}
          availableLanguages={config.availableLanguages}
          alternativeLanguages={config.alternativeLanguages}
          onUpdate={languageOnUpdate}
        >
          <Theme.Provider
            themes={getThemes()}
            onUpdate={themeOnUpdate}
            transformTheme={({ config }) => theme.convertThemeToMaterial(config)}
          >
            <Theme.Consumer>
              {({ theme, originalTheme }) => (
                <MaterialUIThemeProvider theme={theme}>
                  <StyledThemeProvider theme={theme}>
                    <Language.Consumer>
                      {({ key: lang }) => (
                        <LinkProvider lang={lang} component={Link}>
                          <Styles theme={originalTheme.config} />
                          {element}
                        </LinkProvider>
                      )}
                    </Language.Consumer>
                  </StyledThemeProvider>
                </MaterialUIThemeProvider>
              )}
            </Theme.Consumer>
          </Theme.Provider>
        </Language.Provider>
      )}
    </Location>
  )
}

App.propTypes = {
  element: PropTypes.node.isRequired
}

export default App
