const { gql } = require("graphql-tag");

module.exports = gql`
  #scalar type
  scalar DateTime

  type Customer {
    _id: ID
    name: String
    phone_number: String
    brand: String
    type: String
    year: String
    transmission: String
    color: String
    plate_number: String
    createdAt: DateTime
    updatedAt: DateTime
  }
  type SearchCustomer {
    totalSearchData: Int!
    searchData: [Customer]
  }

  input CustomerInput {
    name: String
    phone_number: String
    brand: String
    type: String
    year: String
    transmission: String
    color: String
    plate_number: String
  }
  input SearchCustomerInput {
    name: String
    phone_number: String
    brand: String
    type: String
    year: String
    transmission: String
    color: String
    plate_number: String
    page: Int!
    perPage: Int!
  }
  input GetCustomersPaginationByMonthInput {
    this_month: DateTime
    page: Int!
    perPage: Int!
  }
  input GetTotalCustomersPaginationByMonthInput {
    this_month: DateTime
  }
  input UpdateCustomerInput {
    _id: ID
    name: String
    phone_number: String
    brand: String
    type: String
    year: String
    transmission: String
    color: String
    plate_number: String
  }

  type Query {
    getAllCustomers: [Customer]
    searchCustomer(input: SearchCustomerInput): SearchCustomer
    getCustomersPaginationByMonth(
      input: GetCustomersPaginationByMonthInput
    ): [Customer]
    getTotalCustomersPaginationByMonth(
      input: GetTotalCustomersPaginationByMonthInput
    ): Int!
    getCustomerById(_id: ID): Customer!
  }
  type Mutation {
    addCustomer(input: CustomerInput): Customer!
    updateCustomer(input: UpdateCustomerInput): Customer!
  }
`;
