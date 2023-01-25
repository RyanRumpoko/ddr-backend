const User = require("../models/User");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class DbSettingService {
  async clean() {
    await User.deleteMany({});
  }
  async addUserAdmin() {
    const passwordDev =
      "$2a$12$i3Iq8PN0mrNgBioBC7oWa.2Pnd/ZSgMDyyLw/lq3MHPYfbVfGhAEy";
    const newUser = new User({
      username: "developer",
      password: passwordDev,
      role: "superadmin",
    });
    try {
      await sleep(500);
      await newUser.save();
    } catch (error) {
      console.log(error);
    }
  }
  async populate() {
    await this.clean();
    await this.addUserAdmin();
  }
}

module.exports = new DbSettingService();
