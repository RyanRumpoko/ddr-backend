const checkAuth = require("../../util/checkauth");
const SettingService = require("../../models/SettingService");

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

module.exports = {
  Query: {
    getAllSettingService,
    getAllSettingServicePagination,
    getTotalAllSettingService,
  },
  Mutation: {},
};
