const checkAuth = require("../../util/checkauth");
const Service = require("../../models/Service");
const Invoice = require("../../models/Invoice");

const getAllInvoices = async (_, __, { req }) => {
  try {
    checkAuth(req);
    return await Invoice.find().sort({ createdAt: 1 }).populate("customer_id");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllInvoicesByMonth = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { this_month } = input;
    const changeInputStart = this_month + "-01T00:00:01";
    const changeInputEnd = this_month + "-31T23:59:59";
    return await Invoice.countDocuments({
      createdAt: {
        $gte: new Date(changeInputStart),
        $lte: new Date(changeInputEnd),
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getInvoiceByCustomerId = async (_, { id }, { req }) => {
  try {
    checkAuth(req);
    return await Invoice.find({ customer_id: id }).sort({ createdAt: 1 });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getInvoiceById = async (_, { _id }, { req }) => {
  try {
    checkAuth(req);
    return await Invoice.findById({ _id }).populate("customer_id");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addInvoice = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { invoice_number, service_bulk, customer_id, total_invoice } = input;

    const newInvoice = new Invoice({
      invoice_number,
      customer_id,
      status: "estimated",
      estimated_date: new Date(),
      total_invoice,
    });
    const res = newInvoice.save();
    res.then((doc) => {
      const insertId = service_bulk.map((x) => ({
        ...x,
        invoice_id: doc._id,
      }));
      Service.insertMany(insertId);
    });
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addInvoiceBefore = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const {
      invoice_number,
      service_bulk,
      customer_id,
      total_invoice,
      estimated_date,
      ongoing_date,
    } = input;
    const customer = await Invoice.findOne({
      invoice_number: invoice_number.toUpperCase(),
    });
    if (customer) {
      throw new Error("Nomor invoice sudah di registrasi");
    }

    const newInvoice = new Invoice({
      invoice_number: invoice_number.trim().toUpperCase(),
      customer_id,
      status: "done",
      estimated_date,
      ongoing_date,
      total_invoice,
    });
    const res = newInvoice.save();
    res.then((doc) => {
      const insertId = service_bulk.map((x) => ({
        ...x,
        invoice_id: doc._id,
      }));
      Service.insertMany(insertId);
    });
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addInvoiceNote = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { _id, note } = input;

    const updateNote = await Invoice.findByIdAndUpdate(
      {
        _id,
      },
      {
        note,
      },
      { new: true }
    );
    return updateNote;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getTotalInvoicesToday = async (_, __, { req }) => {
  try {
    checkAuth(req);
    const date = new Date();
    const currentDate = date.toISOString().slice(0, 10);
    const changeInputStart = currentDate + "T00:00:01";
    const changeInputEnd = currentDate + "T23:59:59";

    return await Invoice.countDocuments({
      createdAt: {
        $gte: new Date(changeInputStart),
        $lte: new Date(changeInputEnd),
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateStatus = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { _id, status } = input;
    if (status === "ongoing" || status === "done") {
      const updatedStatus = await Invoice.findByIdAndUpdate(
        {
          _id,
        },
        {
          status,
          ongoing_date: new Date(),
        },
        { new: true }
      );
      return updatedStatus;
    } else if (status === "canceled") {
      const updatedStatus = await Invoice.findByIdAndUpdate(
        {
          _id,
        },
        {
          status,
          canceled_date: new Date(),
        },
        { new: true }
      );
      return updatedStatus;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const searchInvoice = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    let filterObject = [];

    if (
      input.estimated_date_min !== null &&
      input.estimated_date_min !== "" &&
      input.estimated_date_max !== "" &&
      input.estimated_date_max >= input.estimated_date_min
    ) {
      let start = new Date(input.estimated_date_min);
      start.setUTCHours(0, 0, 0, 000);
      let end = new Date(input.estimated_date_max);
      end.setUTCHours(23, 59, 59, 999);
      filterObject.push({
        estimated_date: {
          $gte: start,
          $lte: end,
        },
      });
    }
    if (
      input.ongoing_date_min !== null &&
      input.ongoing_date_min !== "" &&
      input.ongoing_date_max !== "" &&
      input.ongoing_date_max >= input.ongoing_date_min
    ) {
      let start = new Date(input.ongoing_date_min);
      start.setUTCHours(0, 0, 0, 000);
      let end = new Date(input.ongoing_date_max);
      end.setUTCHours(23, 59, 59, 999);
      filterObject.push({
        ongoing_date: {
          $gte: start,
          $lte: end,
        },
      });
    }
    if (input.invoice_number !== "") {
      filterObject.push({
        invoice_number: {
          $regex: input.invoice_number.toUpperCase(),
          $options: "i",
        },
      });
    }
    if (input.total_invoice > 0) {
      filterObject.push({
        total_invoice: input.total_invoice,
      });
    }
    let startIndex = Math.abs(input.page - 1) * input.perPage;
    const totalSearchData = await Invoice.countDocuments({
      $and: filterObject,
    });
    const searchInvoice = await Invoice.find({
      $and: filterObject,
    })
      .populate("customer_id")
      .lean()
      .sort({ createdAt: 1 })
      .limit(input.perPage)
      .skip(startIndex)
      .exec();
    const searchData = searchInvoice.map((e) => e.customer_id);
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

module.exports = {
  Query: {
    getAllInvoices,
    getInvoiceByCustomerId,
    getAllInvoicesByMonth,
    getTotalInvoicesToday,
    getInvoiceById,
    searchInvoice,
  },
  Mutation: {
    addInvoice,
    addInvoiceBefore,
    updateStatus,
    addInvoiceNote,
  },
};
