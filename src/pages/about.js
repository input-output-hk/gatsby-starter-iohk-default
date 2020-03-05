import React from 'react'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Link from '@input-output-hk/front-end-core-components/components/Link'
import Layout from '../components/Layout'
import AboutPageQuery from '../queries/AboutPageQuery'

export default () => (
  <AboutPageQuery
    render={(content) => (
      <Layout>
        <Container maxWidth='lg'>
          <Box marginTop={6} marginBottom={10}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Link href='/'>{content.home_label}</Link>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Layout>
    )}
  />
)
