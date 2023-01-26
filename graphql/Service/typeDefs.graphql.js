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
    estimated_date: DateTime
    ongoing_date: DateTime
    total_invoice: Int
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
    getAllInvoices: [Invoice]
    getInvoiceByCustomerId(id: ID): [Invoice]
    getAllInvoicesByMonth(input: GetAllInvoiceByMonth): Int!
    getServicesByInvoiceId(id: ID): [Service]
    getTotalInvoicesToday: Int!
  }
  type Mutation {
    addService(input: ServiceInput): Service!
    addInvoice(input: InvoiceInput): Boolean!
    updateService(input: UpdateServiceInput): Service!
    deleteService(id: ID, is_disc: Boolean): Boolean!
  }
`;
