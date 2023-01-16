const { gql } = require("graphql-tag");

module.exports = gql`
  #scalar type
  scalar DateTime

  type Service {
    _id: ID
    service_name: String
    quantity: Int
    price: String
    status: String
    invoice_id: Invoice
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Invoice {
    _id: ID
    invoice_number: String
    customer_id: Customer
  }

  input ServiceInput {
    service_name: String
    quantity: Int
    price: String
    status: String
  }
  input InvoiceInput {
    invoice_number: String
    service_bulk: [ServiceInput]
    customer_id: ID
  }

  type Query {
    getAllServices: [Service]
    getAllInvoices: [Invoice]
    getInvoiceByCustomerId(id: ID): [Invoice]
  }
  type Mutation {
    addService(input: ServiceInput): Service!
    addInvoice(input: InvoiceInput): Boolean
  }
`;
