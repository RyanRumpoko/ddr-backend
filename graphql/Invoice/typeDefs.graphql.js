const { gql } = require("graphql-tag");

module.exports = gql`
  #scalar type
  scalar DateTime

  type Invoice {
    _id: ID
    invoice_number: String
    customer_id: Customer
    status: String
    estimated_date: DateTime
    ongoing_date: DateTime
    total_invoice: Int
    createdAt: DateTime
    updatedAt: DateTime
  }

  input InvoiceInput {
    invoice_number: String
    service_bulk: [ServiceInput]
    customer_id: ID
    status: String
    total_invoice: Int
  }
  input GetAllInvoiceByMonth {
    this_month: DateTime
  }
  input UpdateStatusInput {
    _id: ID
    status: String
  }
  input InvoiceBeforeInput {
    invoice_number: String
    service_bulk: [ServiceInput]
    customer_id: ID
    status: String
    total_invoice: Int
    estimated_date: DateTime
    ongoing_date: DateTime
  }

  type Query {
    getAllInvoices: [Invoice]
    getInvoiceByCustomerId(id: ID): [Invoice]
    getAllInvoicesByMonth(input: GetAllInvoiceByMonth): Int!
    getTotalInvoicesToday: Int!
  }
  type Mutation {
    addInvoice(input: InvoiceInput): Boolean!
    addInvoiceBefore(input: InvoiceBeforeInput): Boolean!
    updateStatus(input: UpdateStatusInput): Invoice!
  }
`;
