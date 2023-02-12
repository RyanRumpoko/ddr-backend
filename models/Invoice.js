const mongoose = require("mongoose");
const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    invoice_number: {
      type: String,
      required: true,
      unique: true,
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    status: {
      type: String,
      enum: ["estimated", "ongoing", "done", "canceled"],
      default: "estimated",
      required: true,
    },
    estimated_date: {
      type: Date,
    },
    ongoing_date: {
      type: Date,
    },
    canceled_date: {
      type: Date,
    },
    total_invoice: {
      type: Number,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
