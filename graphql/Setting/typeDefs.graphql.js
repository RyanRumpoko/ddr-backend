const { gql } = require("graphql-tag");

module.exports = gql`
  #scalar type
  scalar DateTime

  type SettingService {
    _id: ID
    service_name: String
    base_price: Int
    is_active: Boolean
    service_type: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  input SettingServiceInput {
    service_name: String
    base_price: Int
    service_type: String
  }
  input GetSettingServicePagination {
    page: Int!
    perPage: Int!
  }

  type Query {
    getAllSettingService: [SettingService]
    getAllSettingServicePagination(
      input: GetSettingServicePagination
    ): [SettingService]
    getTotalAllSettingService: Int!
  }
  type Mutation {
    addSettingService(input: SettingServiceInput): Service!
  }
`;
