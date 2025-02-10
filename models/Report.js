const mongoose = require("mongoose");
const { Schema } = mongoose;

const reportSchema = new Schema(
  {
    name: {
      type: String,
    },
    total_service: {
      type: Number,
    },
    total_non_service: {
      type: Number,
    },
    total_report: {
      type: Number,
    },
    start_date: {
      type: Date,
    },
    finish_date: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
