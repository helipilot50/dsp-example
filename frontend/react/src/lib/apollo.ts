import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core';

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, from, split, Operation, NextLink } from '@apollo/client/link/core';
import { ErrorResponse, onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { HttpLink } from '@apollo/client/link/http';
import { GraphQLError } from 'graphql/error/GraphQLError';
import { FragmentDefinitionNode, OperationDefinitionNode } from 'graphql';


// obtain the host name
const hostName = window.location.hostname;
let routeUrl = `http://${hostName}:4000/graphql`;
let wsUrl = `ws://${hostName}:4000/subscriptions`;
if (process.env.REACT_APP_GQL_URL) {
  routeUrl = process.env.REACT_APP_GQL_URL;
}
if (process.env.REACT_APP_GQL_WS_URL) {
  wsUrl = process.env.REACT_APP_GQL_WS_URL;
}

console.log('routeUrl', routeUrl);
console.log('wsUrl', wsUrl);

// export the client as a window object if it does not exist
interface customWindow extends Window {
  'apollo-client': ApolloClient<NormalizedCacheObject>;
}
declare const window: customWindow;

// get access token
const token = localStorage.getItem('token');

// create a web socket link
const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUrl,
    connectionParams: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      credentials: true
    },
    on: {
      connected: () => console.log('GraphQLWsLink connected'),
      closed: () => console.log('GraphQLWsLink closed'),
    }
  }),
);

// create a httpLink
const httpLink: HttpLink = new HttpLink({
  uri: routeUrl,
});

// create an auth link
const authLink = new ApolloLink((operation: Operation, forward: NextLink) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null,
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      credentials: true
    }
  });

  return forward(operation);
});

// create error link
const errorLink: ApolloLink = onError(({ graphQLErrors, networkError }: ErrorResponse) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }: GraphQLError) => console.error(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
    ));
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Prevent ApolloClient from retrying infinitely on failures
// Doc: https://www.apollographql.com/docs/link/links/retry/
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 20000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: error => !!error,
  },
});

const opsLink: ApolloLink = from([errorLink, retryLink, authLink, httpLink]);

const terminatingLink: ApolloLink = split(
  ({ query }: Operation) => {
    const mainDefinition: OperationDefinitionNode | FragmentDefinitionNode = getMainDefinition(query);
    return (
      mainDefinition.kind === 'OperationDefinition' && mainDefinition.operation === 'subscription'
    );
  },
  wsLink,
  opsLink
);

let clientInstance: ApolloClient<NormalizedCacheObject>;
if (!window['apollo-client']) {
  const newClient = new ApolloClient({
    name: 'react-web-client',
    link: terminatingLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      // See https://www.apollographql.com/docs/react/data/queries#setting-a-fetch-policy
      watchQuery: {
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-and-network'
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    }
  });
  window['apollo-client'] = newClient;
  clientInstance = newClient;
}
else
  clientInstance = window['apollo-client'];

export const client: ApolloClient<NormalizedCacheObject> = clientInstance;



// import { createClient, ClientOptions, Client } from 'graphql-sse';
// SSE class for subscriptions
// class SSELink extends ApolloLink {
//   private client: Client;

//   constructor(options: ClientOptions) {
//     super();
//     this.client = createClient(options);
//   }

//   public request(operation: Operation): Observable<FetchResult> {
//     return new Observable((sink) => {
//       return this.client.subscribe<FetchResult>(
//         { ...operation, query: print(operation.query) },
//         {
//           next: sink.next.bind(sink),
//           complete: sink.complete.bind(sink),
//           error: sink.error.bind(sink),
//         },
//       );
//     });
//   }
// }


