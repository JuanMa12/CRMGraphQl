import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'node-fetch'
import { setContext } from 'apollo-link-context'

//const url = 'http://localhost:4001/';
const url = 'https://sheltered-castle-24825.herokuapp.com/';

const httpLink = createHttpLink({
    uri: url,
    fetch
});

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem('token')

    return {
        headers : {
            ...headers,
            authorization: token ? `Bearer ${token}`: ''
        }
    }
});

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat( httpLink )
})

export default client