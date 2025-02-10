const checkAuth = require("../../util/checkauth");
const Invoice = require("../../models/Invoice");
const Report = require("../../models/Report");
const Service = require("../../models/Service");

const getAllReports = async (_, __, { req }) => {
  try {
    checkAuth(req);
    return await Report.find().sort({ createdAt: 1 });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllReportPagination = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { page, perPage } = input;
    let startIndex = Math.abs(page - 1) * perPage;
    const totalSearchData = await Report.countDocuments();
    const searchData = await Report.find()
      .lean()
      .sort({ createdAt: 1 })
      .limit(parseInt(perPage))
      .skip(startIndex)
      .exec();
    const searchResult = {
      totalSearchData,
      searchData,
    };

    return searchResult;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addReport = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { name, start_date, finish_date } = input;
    let totalReportService = 0;
    let totalReportNonService = 0;
    const checkReport = await Report.findOne({ name });
    if (checkReport) {
      throw new Error("Nama report sudah ada");
    }

    let filterObject = [];
    if (
      start_date !== null &&
      start_date !== "" &&
      finish_date !== "" &&
      finish_date >= start_date
    ) {
      let start = new Date(start_date);
      start.setUTCHours(0, 0, 0, 0o0);
      let end = new Date(finish_date);
      end.setUTCHours(23, 59, 59, 999);
      filterObject.push({
        ongoing_date: {
          $gte: start,
          $lte: end,
        },
      });
    }
    const searchInvoice = await Invoice.find({
      $and: filterObject,
    })
      .sort({ createdAt: 1 })
      .exec();
    const populateInvoiceId = searchInvoice.map((e) => {
      return {
        _id: e._id,
        invoice_number: e.invoice_number,
      };
    });

    for (let i = 0; i < populateInvoiceId.length; i++) {
      let totalService = 0;
      let totalNonService = 0;
      const getService = await Service.find({
        invoice_id: populateInvoiceId[i]._id,
      })
        .sort({ createdAt: 1 })
        .populate("service_name");
      for (let j = 0; j < getService.length; j++) {
        if (getService[j].service_name.service_name === "discount") {
          totalService -= getService[j].total;
        } else if (getService[j].service_name.service_type === "service") {
          totalService += getService[j].total;
        } else if (getService[j].service_name.service_type === "non-service") {
          totalNonService += getService[j].total;
        }
      }

      await Invoice.findByIdAndUpdate(
        {
          _id: populateInvoiceId[i]._id,
        },
        {
          total_service: totalService,
          total_non_service: totalNonService,
        },
        { new: true }
      );
      totalReportService += totalService;
      totalReportNonService += totalNonService;
    }

    const newReport = new Report({
      name: name.toLowerCase(),
      start_date,
      finish_date,
      total_service: totalReportService,
      total_non_service: totalReportNonService,
      total_report: totalReportService + totalReportNonService,
    });
    await newReport.save();

    return newReport;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getReportDetail = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { start_date, finish_date, page, perPage } = input;
    let startIndex = Math.abs(page - 1) * perPage;

    let filterObject = [];
    if (
      start_date !== null &&
      start_date !== "" &&
      finish_date !== "" &&
      finish_date >= start_date
    ) {
      let start = new Date(start_date);
      start.setUTCHours(0, 0, 0, 0o0);
      let end = new Date(finish_date);
      end.setUTCHours(23, 59, 59, 999);
      filterObject.push({
        ongoing_date: {
          $gte: start,
          $lte: end,
        },
      });
    }
    const totalSearchData = await Invoice.countDocuments({
      $and: filterObject,
    });
    const searchData = await Invoice.find({
      $and: filterObject,
    })
      .populate("customer_id")
      .lean()
      .sort({ createdAt: 1 })
      .limit(parseInt(perPage))
      .skip(startIndex)
      .exec();

    const searchResult = {
      totalSearchData,
      searchData,
    };

    return searchResult;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getReportDownload = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { start_date, finish_date } = input;

    let filterObject = [];
    if (
      start_date !== null &&
      start_date !== "" &&
      finish_date !== "" &&
      finish_date >= start_date
    ) {
      let start = new Date(start_date);
      start.setUTCHours(0, 0, 0, 0o0);
      let end = new Date(finish_date);
      end.setUTCHours(23, 59, 59, 999);
      filterObject.push({
        ongoing_date: {
          $gte: start,
          $lte: end,
        },
      });
    }

    const searchData = await Invoice.find({
      $and: filterObject,
    })
      .populate("customer_id")
      .sort({ createdAt: 1 })
      .exec();

    return searchData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// const searchInvoiceForReports = async (_, { input }, { req }) => {
//   try {
//     checkAuth(req);
//     let filterObject = [];

//     if (
//       input.estimated_date_min !== null &&
//       input.estimated_date_min !== "" &&
//       input.estimated_date_max !== "" &&
//       input.estimated_date_max >= input.estimated_date_min
//     ) {
//       let start = new Date(input.estimated_date_min);
//       start.setUTCHours(0, 0, 0, 0o0);
//       let end = new Date(input.estimated_date_max);
//       end.setUTCHours(23, 59, 59, 999);
//       filterObject.push({
//         estimated_date: {
//           $gte: start,
//           $lte: end,
//         },
//       });
//     }
//     if (
//       input.ongoing_date_min !== null &&
//       input.ongoing_date_min !== "" &&
//       input.ongoing_date_max !== "" &&
//       input.ongoing_date_max >= input.ongoing_date_min
//     ) {
//       let start = new Date(input.ongoing_date_min);
//       start.setUTCHours(0, 0, 0, 0o0);
//       let end = new Date(input.ongoing_date_max);
//       end.setUTCHours(23, 59, 59, 999);
//       filterObject.push({
//         ongoing_date: {
//           $gte: start,
//           $lte: end,
//         },
//       });
//     }

//     let startIndex = Math.abs(input.page - 1) * input.perPage;
//     const totalSearchData = await Invoice.countDocuments({
//       $and: filterObject,
//     });
//     const searchInvoice = await Invoice.find({
//       $and: filterObject,
//     })
//       .populate("customer_id")
//       .lean()
//       .sort({ createdAt: 1 })
//       .limit(parseInt(input.perPage))
//       .skip(startIndex)
//       .exec();
//     console.log(searchInvoice, "Hasil Search");
//     const searchData = searchInvoice.map((e) => ({
//       ...e.customer_id,
//       total_invoice: e.total_invoice,
//       total_service: e.total_service,
//       total_non_service: e.total_non_service,
//     }));
//     const searchResult = {
//       totalSearchData,
//       searchData,
//     };

//     return searchResult;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

module.exports = {
  Query: {
    getAllReports,
    getAllReportPagination,
    getReportDetail,
    getReportDownload,
    // searchInvoiceForReports,
  },
  Mutation: {
    addReport,
  },
};
