import React from 'react'
import Select from '@material-ui/core/Select'
import Grid from '@material-ui/core/Grid'
import Language from '@input-output-hk/front-end-core-components/components/Language'
import GlobalContentQuery from '../queries/GlobalContentQuery'

export default () => (
  <Language.Consumer>
    {({ key: lang, availableLanguages, setLang }) => (
      <Grid container>
        <Grid item xs={6}>
          <GlobalContentQuery
            render={(content) => (
              <label>{content.select_language}</label>
            )}
          />
        </Grid>
        <Grid item xs={6}>
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
    )}
  </Language.Consumer>
)
