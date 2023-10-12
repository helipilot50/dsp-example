import { gql } from '@apollo/client/core';

export const ACCOUNTS_LIST = gql`
query Accounts {
  accounts {
    id
    name
    type
    accountExternalId
    currency {
      code
      name
      symbol
    }
    countries {
      code
      name
    }
    retailers {
      id
      name
      status
    }
  }
}
`;


export const ACCOUNT_DETAILS = gql`
query Account($accountId: ID!) {
  account(accountId: $accountId) {
    id
    name
    type
    fee {
      accountServicingFee
      demandSideFee
      isCommerceDisplayManagedServiceFee
      isSponsoredProductsManagedServiceFee
      startDate
      supplySideFee
    }
    currency {
      name
      code
      symbol
    }
    countries {
      code
      name
    }
    retailers{
      id
      name
      status
    }
  }
}
`;


export const ACCOUNT_NEW = gql`
mutation NewAccount($account: NewAccount!) {
  newAccount(account: $account) {
    id
    name
    type

  }
}
`;

export const MAP_ACCOUNT_RETAILERS = gql`
mutation MapAccountRetailers($accountId: ID!, $retailerIds: [ID]!) {
  mapAccountRetailers(accountId: $accountId, retailerIds: $retailerIds) {
    id
    name
    status
  }
}
`;

export const ACCOUNT_CREATED = gql`
subscription AccountCreated {
  accountCreated {
    id
    name
  }
}
`;

