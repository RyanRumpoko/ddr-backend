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
    const { service_name, quantity, price, status, invoice_id } = input;

    const newService = new Service({
      service_name: service_name.toLowerCase(),
      quantity: quantity,
      price: price.toLowerCase(),
      status: status.toLowerCase(),
      customer_id: customer_id,
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
  },
  Mutation: {
    addService,
    addInvoice,
  },
};