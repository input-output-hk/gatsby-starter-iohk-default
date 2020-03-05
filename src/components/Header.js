import React from 'react'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'
import Container from '@material-ui/core/Container'
import { Grid, Box } from '@material-ui/core'
import SelectLanguage from '../components/SelectLanguage'
import SelectTheme from '../components/SelectTheme'
import GlobalContentQuery from '../queries/GlobalContentQuery'

const Title = styled.p`
  margin: 1rem 0;
  font-weight: bold;
  font-size: 2.4rem;
`

const FlexGrid = styled(Grid)`
  display: flex;
`

export default () => (
  <AppBar position='static'>
    <Container maxWidth='lg'>
      <Box marginTop={2} marginBottom={2}>
        <Grid container>
          <FlexGrid item xs={12} md={6}>
            <Box flex={1} display='flex' flexDirection='column' justifyContent='center'>
              <GlobalContentQuery
                render={(content) => (
                  <Title>{content.main_title}</Title>
                )}
              />
            </Box>
          </FlexGrid>
          <FlexGrid item xs={12} md={3}>
            <Box flex={1} display='flex' flexDirection='column' justifyContent='center'>
              <SelectLanguage />
            </Box>
          </FlexGrid>
          <FlexGrid item xs={12} md={3}>
            <Box flex={1} display='flex' flexDirection='column' justifyContent='center'>
              <SelectTheme />
            </Box>
          </FlexGrid>
        </Grid>
      </Box>
    </Container>
  </AppBar>
)
