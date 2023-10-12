import { gql } from "@apollo/client/core";

export const RETAILER_DETAILS = gql`
query Retailer($retailerId: ID!) {
  retailer(id: $retailerId) {
    id
    name
    status
    rank
    countryOfOrigin
    retailRevenue
    parentRevenue
    parentCompanyNetIncome
    operationalFormat
    countriesOfOperation
    retailRevenueCagr
  }
}
`;

export const RETAILER_LIST = gql`
query Retailers($offset: Int, $limit: Int) {
  retailers(offset: $offset, limit: $limit) {
    limit
    offset
    totalCount
    retailers {
      id
      name
      status
      countryOfOrigin
    }
  }
}
`;