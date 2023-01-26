const mongoose = require("mongoose");
const { Schema } = mongoose;

const settingBrandSchema = new Schema(
  {
    brand_name: {
      type: String,
      required: true,
      unique: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SettingBrand", settingBrandSchema);
