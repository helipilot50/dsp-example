import { gql } from '@apollo/client/core';

export const CAMPAIGNS_LIST = gql`
query Campaigns($accountId: ID, $retailerId:ID, $brandId:ID, $page: Int, $size: Int) {
  campaigns (accountId: $accountId, retailerId: $retailerId, brandId:$brandId, page: $page, size: $size){
    totalCount
    page
    size
    campaigns {
      id
      name
      status
      startDate
      endDate
      type
      budget {
        amount
        isCapped
        type
      }
    }
  }
}

`;

export const CAMPAIGN_DETAILS = gql`
query Campaign($campaignId: ID!) {
  campaign(id: $campaignId) {
    id
    name
    status
    type
    lineitems {
      totalCount
      lineitems {
        id
        name
        status
        startDate
        endDate
        budget {
          amount
          isCapped
          type
        }
      }
    }
    startDate
    endDate
    budget {
      amount
      isCapped
      type
    }
  }
}
`;
export const CAMPAIGN_NEW = gql`
mutation NewCampaign($advertiserId: ID!, $campaign: NewCampaign!) {
  newCampaign(advertiserId: $advertiserId, campaign: $campaign) {
    id
    name
  }
}
`;

export const LINEITEM_LIST = gql`
query Lineitems($campaignId: ID!, $offset: Int, $limit: Int) {
  lineitems(campaignId: $campaignId, offset: $offset, limit: $limit) {
    lineitems {
      id
      name
      startDate
      endDate
      status
      budget {
        amount
        isCapped
        type
      }
    }
    totalCount
    offset
    limit
  }
}
`;

export const LINEITEM_DETAILS = gql`
query Lineitem($lineitemId: ID!) {
  lineitem(id: $lineitemId) {
    id
    name
    startDate
    endDate
    status
    campaign {
      id
      name
    }
    budget {
      amount
      isCapped
      type
    }
    financialStatus
  }
}
`;

export const LINEITEM_NEW = gql`
mutation NewLineitem($campaignId: ID!, $lineitem: NewLineitem!) {
  newLineitem(campaignId: $campaignId, lineitem: $lineitem) {
    id
    name
    startDate
    status
    endDate
  }
}
`;

export const LINEITEMS_ACTIVATE = gql`
mutation ActivateLineitems($lineitemIds: [ID]!) {
  activateLineitems(lineitemIds: $lineitemIds) {
    id
    name
    startDate
    status
    endDate
  }
}
`;

export const LINEITEMS_PAUSE = gql`
mutation PauseLineitems($lineitemIds: [ID]!) {
  pauseLineitems(lineitemIds: $lineitemIds) {
    id
    name
    startDate
    status
    endDate
  }
}
`;

export const LINEITEM_ACTIVATED = gql`
subscription LineitemActivated($lineitemId: ID!) {
  lineitemActivated(lineitemId: $lineitemId) {
    id
    name
    status
  }
}
`;

export const LINEITEM_PAUSED = gql`
subscription LineitemPaused($lineitemId: ID!) {
  lineitemPaused(lineitemId: $lineitemId) {
    id
    name
    status
  }
}
`;

