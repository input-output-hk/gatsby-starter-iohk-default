import React from 'react'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Select from '@material-ui/core/Select'
import Grid from '@material-ui/core/Grid'
import Language from '@input-output-hk/front-end-core-components/components/Language'
import Theme from '@input-output-hk/front-end-core-components/components/Theme'
import Link from '@input-output-hk/front-end-core-components/components/Link'
import Layout from '../components/Layout'
import HomePageQuery from '../queries/HomePageQuery'

export default () => (
  <HomePageQuery
    render={(content) => (
      <Language.Consumer>
        {({ key: lang, availableLanguages, setLang }) => (
          <Theme.Consumer>
            {({ key: theme, themes, setTheme }) => (
              <Layout>
                <Container maxWidth='lg'>
                  <Box marginTop={6} marginBottom={10}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Link href='/about/'>{content.about_label}</Link>
                        <p>{content.select_theme}</p>
                        <Select
                          value={theme}
                          onChange={e => setTheme(e.target.value)}
                          native
                        >
                          {themes.map(theme => (
                            <option key={theme.key} value={theme.key}>
                              {theme.config.name}
                            </option>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <p>{content.select_language}</p>
                        <Select
                          value={lang}
                          onChange={e => setLang(e.target.value)}
                          native
                        >
                          {availableLanguages.map(language => (
                            <option key={language.key} value={language.key}>
                              {language.flag} {language.label}
                            </option>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>
                  </Box>
                </Container>
              </Layout>
            )}
          </Theme.Consumer>
        )}
      </Language.Consumer>
    )}
  />
)
