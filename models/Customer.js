const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
