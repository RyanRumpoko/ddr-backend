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
  type SettingServicePagination {
    totalSearchData: Int!
    searchData: [SettingService]
  }
  type SettingBrand {
    _id: ID
    brand_name: String
    is_active: Boolean
    createdAt: DateTime
    updatedAt: DateTime
  }
  type SettingBrandPagination {
    totalSearchData: Int!
    searchData: [SettingBrand]
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
  input SettingBrandInput {
    brand_name: String
    is_active: Boolean
  }
  input GetSettingBrandPagination {
    page: Int!
    perPage: Int!
  }

  type Query {
    getAllSettingService: [SettingService]
    getAllSettingServicePagination(
      input: GetSettingServicePagination
    ): SettingServicePagination
    getAllSettingBrand: [SettingBrand]
    getAllSettingBrandPagination(
      input: GetSettingBrandPagination
    ): SettingBrandPagination
  }
  type Mutation {
    addSettingService(input: SettingServiceInput): SettingService!
    addSettingBrand(input: SettingBrandInput): SettingBrand!
  }
`;
