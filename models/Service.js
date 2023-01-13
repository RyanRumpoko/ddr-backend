const mongoose = require("mongoose");
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    rack_steer: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
