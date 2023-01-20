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

  type Invoice {
    _id: ID
    invoice_number: String
    customer_id: Customer
    status: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  input ServiceInput {
    service_name: String
    quantity: Int
    price: Int
    total: Int
  }
  input InvoiceInput {
    invoice_number: String
    service_bulk: [ServiceInput]
    customer_id: ID
    status: String
  }
  input GetAllInvoiceByMonth {
    this_month: DateTime
  }

  type Query {
    getAllServices: [Service]
    getAllInvoices: [Invoice]
    getInvoiceByCustomerId(id: ID): [Invoice]
    getAllInvoicesByMonth(input: GetAllInvoiceByMonth): Int!
  }
  type Mutation {
    addService(input: ServiceInput): Service!
    addInvoice(input: InvoiceInput): Boolean
  }
`;
