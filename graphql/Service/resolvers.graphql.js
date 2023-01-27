const checkAuth = require("../../util/checkauth");
const Service = require("../../models/Service");
const Invoice = require("../../models/Invoice");
const { validateServiceInput } = require("../../util/validators");

const getAllServices = async (_, __, { req }) => {
  try {
    checkAuth(req);
    return await Service.find().sort({ createdAt: 1 }).populate("invoice_id");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getServiceById = async (_, { id }, { req }) => {
  try {
    checkAuth(req);
    return await Service.findById({ _id: id });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getServicesByInvoiceId = async (_, { id }, { req }) => {
  try {
    checkAuth(req);
    return await Service.find({ invoice_id: id }).sort({ createdAt: 1 });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addService = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { service_name, quantity, price, total, invoice_id, is_disc } = input;

    const { errors, valid } = validateServiceInput(
      service_name,
      quantity,
      price,
      total
    );
    if (!valid) {
      const newErrors = Object.values(errors);
      newErrors.forEach((el) => {
        throw new Error(el);
      });
    }

    const newService = new Service({
      service_name: service_name.toLowerCase(),
      quantity,
      price,
      total,
      invoice_id: invoice_id,
    });

    const res = await newService.save();

    const getInvoice = await Invoice.findById(invoice_id).exec();
    let updatedTotalInvoice = 0;

    if (is_disc) {
      updatedTotalInvoice = getInvoice.total_invoice - total;
    } else {
      updatedTotalInvoice = getInvoice.total_invoice + total;
    }

    await Invoice.findByIdAndUpdate(
      {
        _id: invoice_id,
      },
      {
        total_invoice: updatedTotalInvoice,
      },
      { new: true }
    );

    return {
      ...res._doc,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateService = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { _id, service_name, quantity, price, total, is_disc } = input;

    const { errors, valid } = validateServiceInput(
      service_name,
      quantity,
      price,
      total
    );
    if (!valid) {
      const newErrors = Object.values(errors);
      newErrors.forEach((el) => {
        throw new Error(el);
      });
    }

    const getService = await Service.findById(_id).exec();
    const getInvoice = await Invoice.findById(getService.invoice_id).exec();
    let updatedTotalInvoice = 0;

    if (is_disc) {
      updatedTotalInvoice = getInvoice.total_invoice + getService.total - total;
    } else {
      updatedTotalInvoice = getInvoice.total_invoice - getService.total + total;
    }

    const updateService = await Service.findByIdAndUpdate(
      { _id },
      { $set: input },
      { new: true }
    );

    await Invoice.findByIdAndUpdate(
      {
        _id: getService.invoice_id,
      },
      {
        total_invoice: updatedTotalInvoice,
      },
      { new: true }
    );

    return updateService;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteService = async (_, { id, is_disc }, { req }) => {
  try {
    checkAuth(req);
    const getService = await Service.findById(id).exec();
    const getInvoice = await Invoice.findById(getService.invoice_id).exec();
    let updatedTotalInvoice = getInvoice.total_invoice - getService.total;

    if (is_disc) {
      updatedTotalInvoice = getInvoice.total_invoice + getService.total;
    } else {
      updatedTotalInvoice = getInvoice.total_invoice - getService.total;
    }

    await Invoice.findByIdAndUpdate(
      {
        _id: getService.invoice_id,
      },
      {
        total_invoice: updatedTotalInvoice,
      },
      { new: true }
    );
    await Service.findByIdAndDelete({ _id: id });

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  Query: {
    getAllServices,
    getServiceById,
    getServicesByInvoiceId,
  },
  Mutation: {
    addService,
    updateService,
    deleteService,
  },
};
