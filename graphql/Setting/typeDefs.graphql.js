const { gql } = require("graphql-tag");

module.exports = gql`
  #scalar type
  scalar DateTime

  type SettingService {
    _id: ID
    service_name: String
    base_price: Int
    is_active: Boolean
    createdAt: DateTime
    updatedAt: DateTime
  }

  input SettingServiceInput {
    service_name: String
    base_price: Int
  }

  type Query {
    getAllSettingService: [SettingService]
  }
  type Mutation {
    addSettingService(input: SettingServiceInput): Service!
  }
`;
