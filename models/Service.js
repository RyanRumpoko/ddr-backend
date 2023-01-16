const mongoose = require("mongoose");
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    service_name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["estimated", "ongoing", "done", "canceled"],
      default: "estimated",
      required: true,
    },
    invoice_id: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
