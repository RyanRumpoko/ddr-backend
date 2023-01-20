const checkAuth = require("../../util/checkauth");
const SettingService = require("../../models/SettingService");

const getAllSettingService = async (_, __, { req }) => {
  try {
    checkAuth(req);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  Query: {
    getAllSettingService,
  },
  Mutation: {},
};
