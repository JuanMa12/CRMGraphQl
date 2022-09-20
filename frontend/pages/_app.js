import Layout from '../src/components/Layout'
import { ApolloProvider } from '@apollo/client'
import '../styles/globals.css'
import client from '../config/apollo'

function MyApp({ Component, pageProps }) {
  return <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
         </Layout>
        </ApolloProvider>
}

export default MyApp
