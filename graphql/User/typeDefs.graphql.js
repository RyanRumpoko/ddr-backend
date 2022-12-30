const { gql } = require("graphql-tag");

module.exports = gql`
  #scalar type
  scalar DateTime

  type User {
    _id: ID
    username: String
    token: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type Query {
    getAllUsers: [User]
  }
  type Mutation {
    login(loginInput: LoginInput): User!
  }
`;