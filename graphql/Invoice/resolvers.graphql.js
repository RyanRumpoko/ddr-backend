const checkAuth = require("../../util/checkauth");
const Service = require("../../models/Service");
const Invoice = require("../../models/Invoice");
const { validateServiceInput } = require("../../util/validators");

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
    const updatedStatus = await Invoice.findByIdAndUpdate(
      {
        _id,
      },
      {
        status,
      },
      { new: true }
    );
    return updatedStatus;
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
  },
  Mutation: {
    addInvoice,
    updateStatus,
  },
};
