const { gql } = require("graphql-tag");

module.exports = gql`
  #scalar type
  scalar DateTime

  type Report {
    _id: ID
    name: String
    total_service: Int
    total_non_service: Int
    total_report: Int
    start_date: DateTime
    finish_date: DateTime
    createdAt: DateTime
    updatedAt: DateTime
  }
  type ReportPagination {
    totalSearchData: Int!
    searchData: [Report]
  }
  type Invoice {
    _id: ID
    invoice_number: String
    customer_id: Customer
    status: String
    estimated_date: DateTime
    ongoing_date: DateTime
    total_invoice: Int
    total_service: Int
    total_non_service: Int
    note: String
    createdAt: DateTime
    updatedAt: DateTime
  }
  type ReportDetail {
    totalSearchData: Int!
    searchData: [Invoice]
  }

  input ReportInput {
    name: String
    start_date: DateTime
    finish_date: DateTime
  }
  input ReportPaginationInput {
    page: Int!
    perPage: Int!
  }
  input ReportDetailInput {
    start_date: DateTime
    finish_date: DateTime
    page: Int!
    perPage: Int!
  }
  input ReportDownloadInput {
    start_date: DateTime
    finish_date: DateTime
  }

  type Query {
    getAllReports: [Report]
    getAllReportPagination(input: ReportPaginationInput): ReportPagination
    getReportDetail(input: ReportDetailInput): ReportDetail
    getReportDownload(input: ReportDownloadInput): [Invoice]
  }
  type Mutation {
    addReport(input: ReportInput): Report!
  }
`;
