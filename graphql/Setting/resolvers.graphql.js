const checkAuth = require("../../util/checkauth");
const SettingService = require("../../models/SettingService");
const SettingBrand = require("../../models/SettingBrand");

const getAllSettingService = async (_, __, { req }) => {
  try {
    checkAuth(req);
    return await SettingService.find({
      is_active: true,
    }).sort({ createdAt: 1 });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllSettingServicePagination = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { page, perPage } = input;
    let startIndex = Math.abs(page - 1) * perPage;
    return await SettingService.find({
      is_active: true,
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

const getTotalAllSettingService = async (_, __, { req }) => {
  try {
    checkAuth(req);
    return await SettingService.countDocuments({
      is_active: true,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addSettingService = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { service_name, base_price, service_type } = input;
    const setting = await SettingService.findOne({ service_name });
    if (setting) {
      throw new Error("Nama service sudah ada");
    }

    const newSettingService = new SettingService({
      service_name: service_name.toLowerCase(),
      base_price,
      service_type,
    });
    const res = await newSettingService.save();

    return {
      ...res._doc,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllSettingBrand = async (_, __, { req }) => {
  try {
    checkAuth(req);
    return await SettingBrand.find({
      is_active: true,
    }).sort({ createdAt: 1 });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllSettingBrandPagination = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const { page, perPage } = input;
    let startIndex = Math.abs(page - 1) * perPage;
    return await SettingBrand.find({
      is_active: true,
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

const getTotalAllSettingBrand = async (_, __, { req }) => {
  try {
    checkAuth(req);
    return await SettingBrand.countDocuments({
      is_active: true,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addSettingBrand = async (_, { input }, { req }) => {
  try {
    checkAuth(req);
    const setting = await SettingBrand.findOne({
      brand_name: input.brand_name,
    });
    if (setting) {
      throw new Error("Nama service sudah ada");
    }

    const newSettingBrand = new SettingBrand({
      brand_name: input.brand_name.toLowerCase(),
    });
    const res = await newSettingBrand.save();

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
    getAllSettingService,
    getAllSettingServicePagination,
    getTotalAllSettingService,
    getAllSettingBrand,
    getAllSettingBrandPagination,
    getTotalAllSettingBrand,
  },
  Mutation: {
    addSettingService,
    addSettingBrand,
  },
};
