var mongoose = require("mongoose");

var MedecinesModel = new mongoose.model("Medicines", {
  _id: mongoose.Schema.Types.ObjectId,
  medicine_Name: String,
  medicine_Price: String,
  medicine_Description: String,
  medicine_Quantity: String,
  medicine_ImageUrl: String,
  medicine_Unit: String,

  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patients" }
});
module.exports = MedecinesModel;
