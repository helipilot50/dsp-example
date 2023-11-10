import { gql } from "@apollo/client/core";

export const PRODUCT_DETAILS = gql`
query Sku($skuKey: ID!) {
  sku(skuKey: $skuKey) {
    skuKey
    name
    description
    quantity
    price

    matchingSearchPhrases
    image
  }
}
`;

export const PRODUCT_LIST = gql`
query Skus($offset: Int, $limit: Int) {
  skus(offset: $offset, limit: $limit) {
    skus {
      skuKey
      name
      description
      image
      quantity
      price
    }
    offset
    limit
    totalCount
  }
}
`;