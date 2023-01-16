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

  type Query {
    getAllCustomers: [Customer]
  }
  type Mutation {
    addCustomer(input: CustomerInput): Customer!
  }
`;
