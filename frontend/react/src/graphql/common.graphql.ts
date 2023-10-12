import { gql } from '@apollo/client/core';

export const ALL_COUNTRIES = gql`
query AllCountries {
  countries {
    name
    code
    currency
  }
}
`;


