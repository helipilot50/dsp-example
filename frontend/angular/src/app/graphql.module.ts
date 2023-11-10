import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import {
  ApolloClient, ApolloClientOptions, ApolloLink,
  InMemoryCache, NormalizedCacheObject, split
} from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const uri = process.env['NG_APP_GQL_URL']; //  URL of the GraphQL server here
const wsUrl = process.env['NG_APP_GQL_WS_URL']; //  URL of the GraphQL subscroptions here
console.log('[graphql.module] url', uri);
console.log('[graphql.module] subscriptions url', wsUrl);

// get access token
const token = localStorage.getItem('token');

// export the client as a window object if it does not exist
interface customWindow extends Window {
  'apollo-client': ApolloClient<NormalizedCacheObject>;
}
declare const window: customWindow;

// function to merge the incoming list items withthe existing list items without duplicates
// used by the InMemorytCache
function listMergeNoDuplicates(existing = [], incoming: any) {
  console.debug('[graphql.module.listMergeNoDuplicates] existing', existing);
  return existing.concat(incoming.filter((x: any) => existing.every((y: any) => y.skuKey !== x.skuKey)));
}

const cache = new InMemoryCache({
  typePolicies: {
    SkuList: {
      fields: {
        skus: {
          merge: listMergeNoDuplicates,
        },

      }
    }
  }
});



export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const headers = new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    authorization: token ? `Bearer ${token}` : "",
  });

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

  const opsLink = httpLink.create({
    uri,
    headers,
  });

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const splitLink: ApolloLink = split(
    // split based on operation type
    ({ query }) => {
      const mainDefinition = getMainDefinition(query);
      return mainDefinition.kind === 'OperationDefinition' && mainDefinition.operation === 'subscription';
    },
    wsLink,
    opsLink,
  );

  return {

    link: splitLink,
    cache,
    defaultOptions: {
      // See https://www.apollographql.com/docs/react/data/queries#setting-a-fetch-policy
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network'
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    }
  };
}


@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
