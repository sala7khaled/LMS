var mongoose = require("mongoose");

var PatientsModel = new mongoose.model("Patients", {
  _id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, require: true },
  phone: { type: String },
  password: { type: String, require: true },
  gender: { type: String },
  location: { type: String },
  date: { type: String },
  confirm: { type: String, default: false },
  snn: String,
  medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medicines" }],
  medicines_name: [{ type: String }],
  // requests_name: [{ type: String }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Requests" }],
  results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Results" }]

});
module.exports = PatientsModel;
