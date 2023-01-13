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
  }

  type Query {
    getAllCustomers: [Customer]
  }
  type Mutation {
    addCustomer(input: CustomerInput): Customer!
  }
`;
