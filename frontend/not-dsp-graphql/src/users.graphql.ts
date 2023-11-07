import { gql } from "@apollo/client/core";

export const USER_LIST = gql`
query Users {
  users {
    id
    firstName
    lastName
    username
    primaryEmailAddressId
    primaryPhoneNumberId
    hasImage
    imageUrl
    twoFactorEnabled
    updatedAt
    createdAt
  }
}
`;

export const NEW_PORTFOLIO = gql`
mutation NewPortfolio($name: String!, $description: String) {
  newPortfolio(name: $name, description: $description) {
    id
    name
    description
  }
}
`;

export const LIST_PORTFOLIOS = gql`
query Portfolios {
  portfolios {
    id
    name
    updatedAt
    createdAt
    description
    users {
      id
      username
      firstName
      lastName
    }
  }
}
`;

export const PORTFOLIO_DETAILS = gql`
query Portfolio($portfolioId: ID!) {
  portfolio(portfolioId: $portfolioId) {
    id
    name
    description
    brands {
      id
      name
    }
    users {
      id
      firstName
      lastName
    }
    accounts {
      id
      name
    }
  }
}
`;

export const MAP_PORTFOLIO_USERS = gql`
mutation MapUsersToPortfolio($portfolioId: ID!, $userIds: [ID]!) {
  mapUsersToPortfolio(portfolioId: $portfolioId, userIds: $userIds) {
    id
    name
  }
}
`;