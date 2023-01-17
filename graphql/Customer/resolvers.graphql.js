const checkAuth = require("../../util/checkauth");
const Customer = require("../../models/Customer");

const getAllCustomers = async (_, __, { req }) => {
  try {
    checkAuth(req);
    return await Customer.find().sort({ createdAt: 1 });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addCustomer = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const {
      name,
      phone_number,
      brand,
      type,
      year,
      transmission,
      color,
      plate_number,
    } = input;

    const customer = await Customer.findOne({ plate_number });
    if (customer) {
      throw new Error("Plate number is already registered");
    }

    let changeNumber;
    if (phone_number[0] === "0") {
      changeNumber = phone_number.slice(1);
    } else if (phone_number[0] === "6" && phone_number[1] === "2") {
      changeNumber = phone_number.slice(2);
    } else if (phone_number[0] !== "0") {
      changeNumber = phone_number;
    }

    const newCustomer = new Customer({
      name: name.toLowerCase(),
      phone_number: changeNumber,
      brand: brand.toLowerCase(),
      type: type.toLowerCase(),
      year: year.toLowerCase(),
      transmission: transmission.toLowerCase(),
      color: color.toLowerCase(),
      plate_number: plate_number.toLowerCase(),
    });
    const res = await newCustomer.save();

    return {
      ...res._doc,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  Query: {
    getAllCustomers,
  },
  Mutation: {
    addCustomer,
  },
};
