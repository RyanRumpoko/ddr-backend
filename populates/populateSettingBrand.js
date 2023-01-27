const mongoose = require("mongoose");
const DbSettingBrand = require("./DbSettingBrand");
require("dotenv").config();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

mongoose.connect(
  process.env.DATABASE_LOCAL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  async () => {
    console.log("Starting populating DB...");
    await DbSettingBrand.populate();
    await sleep(5000);

    console.log("DB has been populate...");
    await mongoose.connection.close();
  }
);
