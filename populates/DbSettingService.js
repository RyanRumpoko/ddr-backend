const SettingService = require("../models/SettingService");
const mongoose = require("mongoose");
const fs = require("fs");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class DbSettingService {
  async clean() {
    await SettingService.deleteMany({});
  }
  async addSettingService() {
    let settingServiceData;
    fs.readFile("./seeds/setting_service.json", async function (err, data) {
      if (err) console.log(err);
      else {
        settingServiceData = await JSON.parse(data);
      }
    });
    try {
      await sleep(500);
      await SettingService.create(settingServiceData);
    } catch (error) {
      console.log(error);
    }
  }
  async populate() {
    await this.clean();
    await this.addSettingService();
  }
}

module.exports = new DbSettingService();
