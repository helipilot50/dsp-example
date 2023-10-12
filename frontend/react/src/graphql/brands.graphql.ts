import { gql } from "@apollo/client/core";

export const BRANDS_LIST = gql`
query Brands($offset: Int, $limit: Int) {
  brands(offset: $offset, limit: $limit) {
    brands {
      id
      name
      foundedIn
      country
      brandValue
      industry
    }
    totalCount
    offset
    limit
  }
}
`;

export const BRAND_DETAILS = gql`
query Brand($brandId: ID!) {
  brand(brandId: $brandId) {
    id
    name
    foundedBy
    foundedIn
    country
    keyPeople
    industry
    website
    rank
    # in millions USD
    brandValue
    rating
  }
}
`;