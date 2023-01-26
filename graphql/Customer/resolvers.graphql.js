const checkAuth = require("../../util/checkauth");
const Customer = require("../../models/Customer");
const { validateCustomerInput } = require("../../util/validators");

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

    const customer = await Customer.findOne({
      plate_number: plate_number.trim().toLowerCase(),
    });
    if (customer) {
      throw new Error("Plate nomor sudah di registrasi");
    }

    let changeNumber;
    if (phone_number[0] === "0") {
      changeNumber = phone_number.slice(1);
    } else if (phone_number[0] === "6" && phone_number[1] === "2") {
      changeNumber = phone_number.slice(2);
    } else if (phone_number[0] !== "0") {
      changeNumber = phone_number;
    }

    const { errors, valid } = validateCustomerInput(
      name,
      phone_number,
      brand,
      type,
      year,
      transmission,
      color,
      plate_number
    );
    if (!valid) {
      const newErrors = Object.values(errors);
      newErrors.forEach((el) => {
        throw new Error(el);
      });
    }

    const newCustomer = new Customer({
      name: name.toLowerCase().trim().replace(/ /g, "_"),
      phone_number: changeNumber,
      brand: brand.toLowerCase().trim().replace(/ /g, "_"),
      type: type.toLowerCase().trim().replace(/ /g, "_"),
      year: year.toLowerCase().trim(),
      transmission: transmission.trim().toLowerCase(),
      color: color.toLowerCase().trim(),
      plate_number: plate_number.trim().toLowerCase(),
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

const searchCustomer = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    let filterObject = [];

    if (input.name !== "") {
      filterObject.push({
        name: {
          $regex: `${input.name}`,
          $options: "i",
        },
      });
    }
    if (input.phone_number !== "" && input.phone_number[0] !== "0") {
      filterObject.push({
        $or: [
          {
            phone_number: input.phone_number,
          },
          {
            phone_number: "0" + input.phone_number,
          },
        ],
      });
    } else if (input.phone_number !== "" && input.phone_number[0] === "0") {
      filterObject.push({
        $or: [
          {
            phone_number: input.phone_number,
          },
          {
            phone_number: input.phone_number.slice(1),
          },
        ],
      });
    }
    if (input.brand !== "") {
      filterObject.push({
        brand: {
          $regex: input.brand,
          $options: "i",
        },
      });
    }
    if (input.type !== "") {
      filterObject.push({
        type: {
          $regex: input.type,
          $options: "i",
        },
      });
    }
    if (input.year !== "") {
      filterObject.push({
        year: {
          $regex: input.year,
          $options: "i",
        },
      });
    }
    if (input.transmission !== "") {
      filterObject.push({
        transmission: {
          $regex: input.transmission,
          $options: "i",
        },
      });
    }
    if (input.color !== "") {
      filterObject.push({
        color: {
          $regex: input.color,
          $options: "i",
        },
      });
    }
    if (input.plate_number !== "") {
      filterObject.push({
        plate_number: {
          $regex: input.plate_number,
          $options: "i",
        },
      });
    }

    const searchResult = await Customer.find({
      $and: filterObject,
    });

    return searchResult;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  Query: {
    getAllCustomers,
    searchCustomer,
  },
  Mutation: {
    addCustomer,
  },
};
