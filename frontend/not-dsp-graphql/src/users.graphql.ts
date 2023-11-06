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
