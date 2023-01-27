const SettingBrand = require("../models/SettingBrand");
const mongoose = require("mongoose");
const fs = require("fs");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class DbSettingBrand {
  async clean() {
    await SettingBrand.deleteMany({});
  }
  async addSettingBrand() {
    let settingBrandData;
    fs.readFile("./seeds/setting_brand.json", async function (err, data) {
      if (err) console.log(err);
      else {
        settingBrandData = await JSON.parse(data);
      }
    });
    try {
      await sleep(500);
      await SettingBrand.create(settingBrandData);
    } catch (error) {
      console.log(error);
    }
  }
  async populate() {
    await this.clean();
    await this.addSettingBrand();
  }
}

module.exports = new DbSettingBrand();
