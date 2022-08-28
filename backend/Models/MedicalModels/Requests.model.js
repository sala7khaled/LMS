var mongoose = require("mongoose");
let RequestsModel = new mongoose.model("Requests", {
  _id: mongoose.Schema.Types.ObjectId,

  req_status: { type: String, require: true },
  req_time: { type: String, require: true },
  req_date: { type: String, require: true },
  req_p_id: { type: String, require: true },
  req_p_name: { type: String },
  req_p_phone: { type: String },
  req_comment: { type: String, require: true },
  req_test: { type: String },
  req_notes: { type: String },
  req_category: { type: String },
  req_testPeriod: { type: String },
  req_testPrice: { type: String },
  req_testDesc: { type: String },
  c_id: { type: String, require: true },
  t_id: { type: String, require: true }



});
module.exports = RequestsModel;
