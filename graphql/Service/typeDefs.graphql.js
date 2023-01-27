const { gql } = require("graphql-tag");

module.exports = gql`
  #scalar type
  scalar DateTime

  type Service {
    _id: ID
    service_name: String
    quantity: Int
    price: Int
    invoice_id: Invoice
    total: Int
    createdAt: DateTime
    updatedAt: DateTime
  }

  input ServiceInput {
    service_name: String
    quantity: Int
    price: Int
    total: Int
    invoice_id: ID
    is_disc: Boolean
  }
  input UpdateServiceInput {
    _id: ID
    service_name: String
    quantity: Int
    price: Int
    total: Int
    is_disc: Boolean
  }

  type Query {
    getAllServices: [Service]
    getServiceById(id: ID): Service
    getServicesByInvoiceId(id: ID): [Service]
  }
  type Mutation {
    addService(input: ServiceInput): Service!
    updateService(input: UpdateServiceInput): Service!
    deleteService(id: ID, is_disc: Boolean): Boolean!
  }
`;
