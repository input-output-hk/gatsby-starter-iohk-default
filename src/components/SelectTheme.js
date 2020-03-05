import React from 'react'
import Select from '@material-ui/core/Select'
import Grid from '@material-ui/core/Grid'
import Theme from '@input-output-hk/front-end-core-components/components/Theme'
import GlobalContentQuery from '../queries/GlobalContentQuery'

export default () => (
  <Theme.Consumer>
    {({ key: theme, themes, setTheme }) => (
      <Grid container>
        <Grid item xs={6}>
          <GlobalContentQuery
            render={(content) => (
              <label>{content.select_theme}</label>
            )}
          />
        </Grid>
        <Grid item xs={6}>
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
      </Grid>
    )}
  </Theme.Consumer>
)
