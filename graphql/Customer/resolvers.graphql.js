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

    let startIndex = Math.abs(input.page - 1) * input.perPage;
    const totalSearchData = await Customer.countDocuments({
      $and: filterObject,
    });
    const searchData = await Customer.find({
      $and: filterObject,
    })
      .lean()
      .sort({ createdAt: 1 })
      .limit(input.perPage)
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

const getCustomersPaginationByMonth = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { page, perPage, this_month } = input;
    const changeInputStart = this_month + "-01T00:00:01";
    const changeInputEnd = this_month + "-31T23:59:59";
    let startIndex = Math.abs(page - 1) * perPage;

    return await Customer.find({
      is_active: true,
      createdAt: {
        $gte: new Date(changeInputStart),
        $lte: new Date(changeInputEnd),
      },
    })
      .lean()
      .sort({ createdAt: 1 })
      .limit(perPage)
      .skip(startIndex)
      .exec();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getTotalCustomersPaginationByMonth = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { this_month } = input;
    const changeInputStart = this_month + "-01T00:00:01";
    const changeInputEnd = this_month + "-31T23:59:59";

    return await Customer.countDocuments({
      is_active: true,
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

module.exports = {
  Query: {
    getAllCustomers,
    searchCustomer,
    getCustomersPaginationByMonth,
    getTotalCustomersPaginationByMonth,
  },
  Mutation: {
    addCustomer,
  },
};
