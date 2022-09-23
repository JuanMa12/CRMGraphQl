import Layout from '../src/components/Layout'
import { ApolloProvider } from '@apollo/client'

import '../styles/globals.css'
import client from '../config/apollo'
import OrderState from '../src/context/orders/OrderState'

function MyApp({ Component, pageProps }) {
  return <ApolloProvider client={client}>
            <OrderState>
              <Layout>
                  <Component {...pageProps} />
              </Layout>
            </OrderState>
        </ApolloProvider>
}

export default MyApp
