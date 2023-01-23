const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    phone_number: {
      type: String,
      match: [/^[0-9]*$/],
    },
    name: {
      type: String,
    },
    brand: {
      type: String,
    },
    type: {
      type: String,
    },
    year: {
      type: String,
    },
    transmission: {
      type: String,
    },
    color: {
      type: String,
    },
    plate_number: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
