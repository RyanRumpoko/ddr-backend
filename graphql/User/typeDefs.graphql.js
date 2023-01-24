const { gql } = require("graphql-tag");

module.exports = gql`
  #scalar type
  scalar DateTime

  type User {
    _id: ID
    username: String
    role: String
    token: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  input LoginInput {
    username: String!
    password: String!
  }
  input LogoutInput {
    _id: ID!
  }
  input UserInput {
    username: String!
    password: String!
    role: String
  }
  input ChangePasswordInput {
    _id: ID!
    password: String!
  }

  type Query {
    getAllUsers: [User]
    getUserById(_id: ID): User
  }
  type Mutation {
    login(input: LoginInput): User!
    logout(input: LogoutInput): Boolean
    addUser(input: UserInput): User!
    changePassword(input: ChangePasswordInput): Boolean
  }
`;
