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
    note: String
    createdAt: DateTime
    updatedAt: DateTime
  }
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
  type SearchInvoice {
    totalSearchData: Int!
    searchData: [Customer]
  }

  input ServiceInput {
    service_name: ID
    quantity: Int
    price: Int
    total: Int
    invoice_id: ID
    is_disc: Boolean
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
  input NoteInput {
    _id: ID
    note: String
  }
  input SearchInvoiceInput {
    invoice_number: String
    estimated_date_min: DateTime
    estimated_date_max: DateTime
    ongoing_date_min: DateTime
    ongoing_date_max: DateTime
    total_invoice: Int
    page: Int!
    perPage: Int!
  }

  type Query {
    getAllInvoices: [Invoice]
    getInvoiceByCustomerId(id: ID): [Invoice]
    getAllInvoicesByMonth(input: GetAllInvoiceByMonth): Int!
    getTotalInvoicesToday: Int!
    getInvoiceById(_id: ID): Invoice!
    searchInvoice(input: SearchInvoiceInput): SearchInvoice
  }
  type Mutation {
    addInvoice(input: InvoiceInput): Boolean!
    addInvoiceBefore(input: InvoiceBeforeInput): Boolean!
    updateStatus(input: UpdateStatusInput): Invoice!
    addInvoiceNote(input: NoteInput): Invoice!
  }
`;
