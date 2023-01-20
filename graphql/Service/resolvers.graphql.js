const checkAuth = require("../../util/checkauth");
const Service = require("../../models/Service");
const Invoice = require("../../models/Invoice");

const getAllServices = async (_, __, { req }) => {
  try {
    checkAuth(req);
    return await Service.find().sort({ createdAt: 1 }).populate("invoice_id");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addService = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { service_name, quantity, price, invoice_id } = input;

    const newService = new Service({
      service_name: service_name.toLowerCase(),
      quantity: quantity,
      price: price.toLowerCase(),
      invoice_id: invoice_id,
    });

    const res = await newService.save();

    return {
      ...res._doc,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

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
    const { invoice_number, service_bulk, customer_id } = input;

    const newInvoice = new Invoice({
      invoice_number,
      customer_id,
      status: "estimated",
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

module.exports = {
  Query: {
    getAllServices,
    getAllInvoices,
    getInvoiceByCustomerId,
    getAllInvoicesByMonth,
  },
  Mutation: {
    addService,
    addInvoice,
  },
};
