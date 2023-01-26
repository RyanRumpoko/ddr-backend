const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Service = require("../models/Service");
const excel = require("exceljs");

router.post("/download/invoice", async function (req, res) {
  const { _id } = req ? req.body : "";
  const searchInvoice = await Invoice.findById({ _id })
    .populate("customer_id")
    .exec();
  const serviceData = await Service.find({ invoice_id: _id });
  if (!searchInvoice || !serviceData) {
    return res.status(500).send("Error");
  }
  const {
    name,
    phone_number,
    brand,
    type,
    year,
    transmission,
    color,
    plate_number,
  } = searchInvoice.customer_id;
  let isDiscount = false;
  let totalDiscount = 0;

  let workbook = new excel.Workbook({ useStyles: true });
  let worksheet = workbook.addWorksheet("Invoice");
  worksheet.columns = [
    { width: 15 },
    { width: 35 },
    { width: 15 },
    { width: 15 },
  ];
  worksheet.addRow(["NAMA", `: ${name.toUpperCase()}`]);
  worksheet.addRow(["NO TELEPON", `: 0${phone_number}`]);
  worksheet.addRow([
    "JENIS MOBIL",
    `: ${brand.toUpperCase()} ${type.toUpperCase()} / ${transmission.toUpperCase()} / ${year.toUpperCase()} / ${color.toUpperCase()}`,
  ]);
  worksheet.addRow(["PLAT NOMOR", `: ${plate_number.toUpperCase()}`]);
  worksheet.addRow([
    "NOMOR INVOICE",
    `: ${searchInvoice.invoice_number.toLocaleUpperCase()}`,
  ]);
  worksheet.addRow();
  worksheet.addRow(["BANYAKNYA", "NAMA BARANG", "HARGA", "JUMLAH"]);
  serviceData.forEach((el) => {
    if (el.service_name !== "discount") {
      worksheet.addRow([
        `${Number(el.quantity)}`,
        `${el.service_name}`,
        `${Number(el.price)}`,
        `${Number(el.total)}`,
      ]);
    } else {
      isDiscount = true;
      totalDiscount = el.total;
    }
  });
  worksheet.addRow();
  if (isDiscount) {
    worksheet.addRow(["", "", "DISCOUNT", `${totalDiscount}`]);
  }
  worksheet.addRow(["", "", "TOTAL", `${searchInvoice.total_invoice}`]);

  worksheet.getCell("A7").alignment = { horizontal: "center" };
  worksheet.getCell("B7").alignment = { horizontal: "center" };
  worksheet.getCell("C7").alignment = { horizontal: "center" };
  worksheet.getCell("D7").alignment = { horizontal: "center" };

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
    // res.flush();
  });
});

module.exports = router;
