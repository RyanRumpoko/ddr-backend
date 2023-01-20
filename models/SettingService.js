const mongoose = require("mongoose");
const { Schema } = mongoose;

const settingServiceSchema = new Schema(
  {
    service_name: {
      type: String,
      required: true,
      unique: true,
    },
    base_price: {
      type: Number,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SettingService", settingServiceSchema);
